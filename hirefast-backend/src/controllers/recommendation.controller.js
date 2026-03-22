import Connection from '../models/Connection.js';
import Job from '../models/Job.js';
import Post from '../models/Post.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';

const toLowerSet = (arr) => new Set((arr || []).map((item) => item.toString().toLowerCase()));

export const getRecommendations = async (req, res) => {
  const myProfile = await Profile.findOne({ user: req.user._id });
  const mySkills = myProfile?.skills || [];
  const mySkillSet = toLowerSet(mySkills);

  const links = await Connection.find({
    status: 'accepted',
    $or: [{ requester: req.user._id }, { recipient: req.user._id }]
  }).select('requester recipient');

  const connectedIds = new Set(
    links.map((item) =>
      item.requester.toString() === req.user._id.toString() ? item.recipient.toString() : item.requester.toString()
    )
  );

  const candidateProfiles = await Profile.find({
    user: { $ne: req.user._id },
    visibility: { $in: ['public', 'connections'] }
  })
    .populate('user', 'name email role')
    .limit(200);

  const people = candidateProfiles
    .map((profile) => {
      const userId = profile.user?._id?.toString();
      if (!userId || connectedIds.has(userId)) return null;

      const shared = (profile.skills || []).filter((skill) => mySkillSet.has(skill.toLowerCase()));
      return {
        user: profile.user,
        profile,
        sharedSkills: shared,
        score: shared.length
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const jobsRaw = await Job.find({ status: 'open' }).sort({ createdAt: -1 }).limit(200);
  const jobs = jobsRaw
    .map((job) => {
      const overlap = (job.skills || []).filter((skill) => mySkillSet.has(skill.toLowerCase()));
      return {
        ...job.toObject(),
        matchSkills: overlap,
        score: overlap.length
      };
    })
    .sort((a, b) => b.score - a.score || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const postsRaw = await Post.find().populate('author', 'name email role').sort({ createdAt: -1 }).limit(150);
  const posts = postsRaw
    .map((post) => {
      const content = (post.content || '').toLowerCase();
      const keywordHits = mySkills.filter((skill) => content.includes(skill.toLowerCase())).length;
      return {
        ...post.toObject(),
        score: keywordHits
      };
    })
    .sort((a, b) => b.score - a.score || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return res.json({ people, jobs, posts });
};

export const getSimpleSuggestedConnections = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('name email role').limit(12);
  return res.json(users);
};
