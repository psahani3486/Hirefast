import Notification from '../models/Notification.js';

export const streamNotifications = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendPayload = async () => {
    const [items, unread] = await Promise.all([
      Notification.find({ user: req.user._id })
        .populate('actor', 'name email role')
        .sort({ createdAt: -1 })
        .limit(20),
      Notification.countDocuments({ user: req.user._id, read: false })
    ]);

    res.write(`event: notifications\n`);
    res.write(`data: ${JSON.stringify({ unread, items })}\n\n`);
  };

  await sendPayload();

  const interval = setInterval(() => {
    sendPayload().catch(() => {});
  }, 10000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
};
