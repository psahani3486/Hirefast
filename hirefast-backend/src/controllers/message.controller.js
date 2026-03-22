import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';

const buildOtherId = (message, me) =>
  message.sender.toString() === me.toString() ? message.recipient.toString() : message.sender.toString();

export const listConversations = async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }]
  }).sort({ createdAt: -1 });

  const grouped = new Map();

  messages.forEach((item) => {
    const otherId = buildOtherId(item, req.user._id);

    if (!grouped.has(otherId)) {
      grouped.set(otherId, {
        userId: otherId,
        lastMessage: item,
        unreadCount: 0
      });
    }

    if (item.recipient.toString() === req.user._id.toString() && !item.read) {
      const entry = grouped.get(otherId);
      entry.unreadCount += 1;
      grouped.set(otherId, entry);
    }
  });

  const userIds = Array.from(grouped.keys());
  const users = await User.find({ _id: { $in: userIds } }).select('name email role');
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  const result = Array.from(grouped.values())
    .map((item) => ({
      user: userMap.get(item.userId) || null,
      lastMessage: item.lastMessage,
      unreadCount: item.unreadCount
    }))
    .filter((item) => item.user)
    .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());

  return res.json(result);
};

export const listThreadMessages = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: userId },
      { sender: userId, recipient: req.user._id }
    ]
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .limit(500);

  await Message.updateMany(
    { sender: userId, recipient: req.user._id, read: false },
    { $set: { read: true } }
  );

  return res.json(messages);
};

export const sendMessage = async (req, res) => {
  const { userId } = req.params;
  const text = (req.body.text || '').toString().trim();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  if (!text) {
    return res.status(400).json({ message: 'Message text is required' });
  }

  const user = await User.findById(userId).select('_id');
  if (!user) {
    return res.status(404).json({ message: 'Recipient not found' });
  }

  const message = await Message.create({
    sender: req.user._id,
    recipient: userId,
    text
  });

  await message.populate('sender', 'name email role');
  await message.populate('recipient', 'name email role');

  return res.status(201).json(message);
};

export const unreadMessageCount = async (req, res) => {
  const count = await Message.countDocuments({ recipient: req.user._id, read: false });
  return res.json({ unread: count });
};
