import Post from '../models/Post.js';
import ProfileView from '../models/ProfileView.js';

export const getMyAnalytics = async (req, res) => {
  const [profileViews30d, profileViews7d, posts] = await Promise.all([
    ProfileView.countDocuments({
      profileOwner: req.user._id,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }),
    ProfileView.countDocuments({
      profileOwner: req.user._id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }),
    Post.find({ author: req.user._id }).sort({ createdAt: -1 }).limit(100)
  ]);

  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

  const topPosts = posts
    .map((post) => ({
      _id: post._id,
      contentPreview: post.content.slice(0, 100),
      likes: post.likes.length,
      comments: post.comments.length,
      engagement: post.likes.length + post.comments.length,
      createdAt: post.createdAt
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  return res.json({
    profileViews30d,
    profileViews7d,
    totalPosts,
    totalLikes,
    totalComments,
    avgLikesPerPost: totalPosts ? Number((totalLikes / totalPosts).toFixed(2)) : 0,
    avgCommentsPerPost: totalPosts ? Number((totalComments / totalPosts).toFixed(2)) : 0,
    topPosts
  });
};
