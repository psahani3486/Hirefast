import Connection from '../models/Connection.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Post from '../models/Post.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';

export const globalSearch = async (req, res) => {
  const q = (req.query.q || '').toString().trim();

  if (!q) {
    return res.json({ people: [], jobs: [], companies: [], posts: [] });
  }

  const [users, jobs, companies, posts, myConnections] = await Promise.all([
    User.find({
      $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }],
      _id: { $ne: req.user._id }
    })
      .select('name email role')
      .limit(10),
    Job.find({
      status: 'open',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    })
      .select('title company location createdAt')
      .sort({ createdAt: -1 })
      .limit(10),
    Company.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { industry: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name industry location website')
      .sort({ createdAt: -1 })
      .limit(10),
    Post.find({ content: { $regex: q, $options: 'i' } })
      .populate('author', 'name email role')
      .select('author content createdAt likes comments')
      .sort({ createdAt: -1 })
      .limit(10),
    Connection.find({
      status: 'accepted',
      $or: [{ requester: req.user._id }, { recipient: req.user._id }]
    }).select('requester recipient')
  ]);

  const connectedUserIds = new Set(
    myConnections.map((item) =>
      item.requester.toString() === req.user._id.toString() ? item.recipient.toString() : item.requester.toString()
    )
  );

  const profiles = await Profile.find({ user: { $in: users.map((item) => item._id) } }).select(
    'user headline location visibility'
  );
  const profileMap = new Map(profiles.map((item) => [item.user.toString(), item]));

  const people = users
    .map((user) => {
      const profile = profileMap.get(user._id.toString());
      const visibility = profile?.visibility || 'public';
      const isConnected = connectedUserIds.has(user._id.toString());

      if (visibility === 'private') return null;
      if (visibility === 'connections' && !isConnected) return null;

      return {
        user,
        profile: profile || null,
        isConnected
      };
    })
    .filter(Boolean);

  return res.json({ people, jobs, companies, posts });
};
