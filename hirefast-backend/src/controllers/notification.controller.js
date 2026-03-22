import Notification from '../models/Notification.js';

export const listMyNotifications = async (req, res) => {
  const items = await Notification.find({ user: req.user._id })
    .populate('actor', 'name email role')
    .populate('post', 'content')
    .sort({ createdAt: -1 })
    .limit(100);

  return res.json(items);
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.json(notification);
};
