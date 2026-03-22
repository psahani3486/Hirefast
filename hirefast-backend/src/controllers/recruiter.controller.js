import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getApplicantsForJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const applicants = await Application.find({ job: job._id })
    .populate('candidate', 'name email')
    .sort({ createdAt: -1 });

  return res.json(applicants);
};

export const getRecruiterDashboard = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).select('_id title createdAt');
  const jobIds = jobs.map((job) => job._id);

  const [totalApplicants, latestApplicants] = await Promise.all([
    Application.countDocuments({ job: { $in: jobIds } }),
    Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  return res.json({
    totalJobs: jobs.length,
    totalApplicants,
    jobs,
    latestApplicants
  });
};
