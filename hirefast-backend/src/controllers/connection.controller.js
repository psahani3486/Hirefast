import mongoose from 'mongoose';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';

export const sendConnectionRequest = async (req, res) => {
  const { recipientId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(recipientId)) {
    return res.status(400).json({ message: 'Invalid recipient id' });
  }

  if (recipientId === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot connect with yourself' });
  }

  const existing = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: recipientId },
      { requester: recipientId, recipient: req.user._id }
    ]
  });

  if (existing) {
    return res.status(409).json({ message: `Connection already ${existing.status}` });
  }

  const connection = await Connection.create({
    requester: req.user._id,
    recipient: recipientId,
    status: 'pending'
  });

  await Notification.create({
    user: recipientId,
    actor: req.user._id,
    type: 'connection_request',
    message: `${req.user.name} sent you a connection request`
  });

  return res.status(201).json(connection);
};

export const respondToConnectionRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid connection id' });
  }

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const connection = await Connection.findOne({
    _id: id,
    recipient: req.user._id,
    status: 'pending'
  });

  if (!connection) {
    return res.status(404).json({ message: 'Connection request not found' });
  }

  connection.status = action === 'accept' ? 'accepted' : 'rejected';
  await connection.save();

  if (connection.status === 'accepted') {
    await Notification.create({
      user: connection.requester,
      actor: req.user._id,
      type: 'connection_accepted',
      message: `${req.user.name} accepted your connection request`
    });
  }

  return res.json(connection);
};

export const removeConnection = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid connection id' });
  }

  const connection = await Connection.findOneAndDelete({
    _id: id,
    $or: [{ requester: req.user._id }, { recipient: req.user._id }]
  });

  if (!connection) {
    return res.status(404).json({ message: 'Connection not found' });
  }

  return res.json({ message: 'Connection removed' });
};

export const getMyConnections = async (req, res) => {
  const [incoming, outgoing, accepted] = await Promise.all([
    Connection.find({ recipient: req.user._id, status: 'pending' })
      .populate('requester', 'name email role')
      .sort({ createdAt: -1 }),
    Connection.find({ requester: req.user._id, status: 'pending' })
      .populate('recipient', 'name email role')
      .sort({ createdAt: -1 }),
    Connection.find({
      status: 'accepted',
      $or: [{ recipient: req.user._id }, { requester: req.user._id }]
    })
      .populate('requester', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ updatedAt: -1 })
  ]);

  return res.json({ incoming, outgoing, accepted });
};
