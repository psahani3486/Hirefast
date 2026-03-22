import Job from '../models/Job.js';
import Profile from '../models/Profile.js';

const tokenize = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const overlapScore = (aTokens, bTokens) => {
  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  let overlap = 0;

  bSet.forEach((token) => {
    if (aSet.has(token)) overlap += 1;
  });

  if (bSet.size === 0) return 0;
  return Math.min(100, Math.round((overlap / bSet.size) * 100));
};

export const getAiJobRecommendations = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  const profileTokens = tokenize(
    [profile?.headline, profile?.about, (profile?.skills || []).join(' ')].filter(Boolean).join(' ')
  );

  const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 }).limit(100);

  const ranked = jobs
    .map((job) => {
      const jobTokens = tokenize(
        [job.title, job.company, job.location, job.description, (job.skills || []).join(' ')].join(' ')
      );
      const score = overlapScore(profileTokens, jobTokens);
      return {
        job,
        aiMatchScore: score,
        rationale:
          score > 70
            ? 'Strong skill/profile overlap'
            : score > 40
              ? 'Moderate overlap'
              : 'Low overlap; consider upskilling for this role'
      };
    })
    .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
    .slice(0, 10);

  return res.json(ranked);
};

export const scoreResumeAgainstJobs = async (req, res) => {
  const resumeText = (req.body.resumeText || '').toString().trim();

  if (!resumeText) {
    return res.status(400).json({ message: 'resumeText is required' });
  }

  const resumeTokens = tokenize(resumeText);
  const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 }).limit(100);

  const ranked = jobs
    .map((job) => {
      const jobTokens = tokenize(
        [job.title, job.company, job.location, job.description, (job.skills || []).join(' ')].join(' ')
      );
      const score = overlapScore(resumeTokens, jobTokens);
      return {
        job,
        aiMatchScore: score,
        rationale:
          score > 70
            ? 'Resume strongly matches this role'
            : score > 40
              ? 'Resume partially matches this role'
              : 'Resume has low overlap with this role'
      };
    })
    .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
    .slice(0, 10);

  return res.json(ranked);
};
