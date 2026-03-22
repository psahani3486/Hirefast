import mongoose from 'mongoose';
import Connection from '../models/Connection.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

const postPopulateQuery = [
  { path: 'author', select: 'name email role' },
  { path: 'comments.user', select: 'name email role' }
];

export const createPost = async (req, res) => {
  const { content, imageUrl } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Post content is required' });
  }

  const post = await Post.create({
    author: req.user._id,
    content: content.trim(),
    imageUrl: imageUrl?.trim() || ''
  });

  await post.populate(postPopulateQuery);

  return res.status(201).json(post);
};

export const getFeed = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);
  const skip = (page - 1) * limit;

  const connections = await Connection.find({
    status: 'accepted',
    $or: [{ requester: req.user._id }, { recipient: req.user._id }]
  }).select('requester recipient');

  const connectedIds = connections.map((item) =>
    item.requester.toString() === req.user._id.toString() ? item.recipient : item.requester
  );

  const authorIds = [req.user._id, ...connectedIds];

  const [items, total] = await Promise.all([
    Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(postPopulateQuery),
    Post.countDocuments({ author: { $in: authorIds } })
  ]);

  return res.json({
    data: items,
    page,
    limit,
    total,
    hasMore: skip + items.length < total
  });
};

export const toggleLikePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post id' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const alreadyLiked = post.likes.some((item) => item.toString() === req.user._id.toString());

  if (alreadyLiked) {
    post.likes = post.likes.filter((item) => item.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);

    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        actor: req.user._id,
        type: 'post_like',
        message: `${req.user.name} liked your post`,
        post: post._id
      });
    }
  }

  await post.save();
  await post.populate(postPopulateQuery);

  return res.json(post);
};

export const addCommentToPost = async (req, res) => {
  const { id } = req.params;
  const text = (req.body.text || '').toString().trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post id' });
  }

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.comments.push({
    user: req.user._id,
    text
  });
  await post.save();

  if (post.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: post.author,
      actor: req.user._id,
      type: 'post_comment',
      message: `${req.user.name} commented on your post`,
      post: post._id
    });
  }

  await post.populate(postPopulateQuery);

  return res.status(201).json(post);
};
