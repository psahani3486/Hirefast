import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import Connection from '../models/Connection.js';
import ProfileView from '../models/ProfileView.js';

const profileProjection = 'headline about location photoUrl bannerUrl visibility skills experience education';

export const getMyProfile = async (req, res) => {
  let profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email role');

  if (!profile) {
    profile = await Profile.create({ user: req.user._id });
    profile = await profile.populate('user', 'name email role');
  }

  return res.json(profile);
};

export const upsertMyProfile = async (req, res) => {
  const allowedFields = [
    'headline',
    'about',
    'location',
    'photoUrl',
    'bannerUrl',
    'visibility',
    'skills',
    'experience',
    'education'
  ];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
  );

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate('user', 'name email role');

  return res.json(profile);
};

export const getProfileByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await User.findById(userId).select('name email role');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let profile = await Profile.findOne({ user: userId }).select(profileProjection);
  if (!profile) {
    profile = await Profile.create({ user: userId });
  }

  const connection = await Connection.findOne({
    status: 'accepted',
    $or: [
      { requester: req.user._id, recipient: userId },
      { requester: userId, recipient: req.user._id }
    ]
  });

  const isSelf = req.user._id.toString() === userId;
  const isConnected = Boolean(connection);

  if (!isSelf) {
    if (profile.visibility === 'private') {
      return res.status(403).json({ message: 'This profile is private' });
    }

    if (profile.visibility === 'connections' && !isConnected) {
      return res.status(403).json({ message: 'This profile is visible to connections only' });
    }

    await ProfileView.create({ profileOwner: userId, viewer: req.user._id });
  }

  return res.json({
    user,
    profile,
    isConnected,
    isSelf
  });
};

export const discoverProfiles = async (req, res) => {
  const query = (req.query.q || '').toString().trim();

  const users = await User.find({
    _id: { $ne: req.user._id },
    ...(query
      ? {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      : {})
  })
    .select('name email role')
    .limit(20);

  const userIds = users.map((item) => item._id);
  const profiles = await Profile.find({ user: { $in: userIds } }).select('user headline location skills photoUrl');
  const profileMap = new Map(profiles.map((item) => [item.user.toString(), item]));

  const links = await Connection.find({
    $or: [
      { requester: req.user._id, recipient: { $in: userIds } },
      { requester: { $in: userIds }, recipient: req.user._id }
    ]
  }).select('requester recipient status');

  const statusMap = new Map();
  links.forEach((item) => {
    const otherId =
      item.requester.toString() === req.user._id.toString()
        ? item.recipient.toString()
        : item.requester.toString();
    statusMap.set(otherId, item.status);
  });

  return res.json(
    users
      .map((user) => {
        const profile = profileMap.get(user._id.toString()) || null;
        const connectionStatus = statusMap.get(user._id.toString()) || 'none';

        if (profile?.visibility === 'private') {
          return null;
        }

        if (profile?.visibility === 'connections' && connectionStatus !== 'accepted') {
          return null;
        }

        return {
          user,
          profile,
          connectionStatus
        };
      })
      .filter(Boolean)
  );
};
