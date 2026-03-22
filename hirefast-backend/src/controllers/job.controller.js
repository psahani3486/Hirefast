import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { getPagination } from '../utils/pagination.js';
import { cacheService } from '../config/redis.js';

export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    recruiter: req.user._id
  });

  await cacheService.delByPrefix('/api/jobs').catch(() => {});

  return res.status(201).json(job);
};

export const listJobs = async (req, res) => {
  const { q, location, company, status } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  filter.status = status === 'closed' ? 'closed' : 'open';
  if (q) {
    filter.title = { $regex: q, $options: 'i' };
  }
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  if (company) {
    filter.company = { $regex: company, $options: 'i' };
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('recruiter', 'name email'),
    Job.countDocuments(filter)
  ]);

  return res.json({
    data: jobs,
    page,
    limit,
    total,
    hasMore: skip + jobs.length < total
  });
};

export const getJobById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  const job = await Job.findById(req.params.id).populate('recruiter', 'name email');
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  return res.json(job);
};

export const applyToJob = async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.status === 'closed') {
    return res.status(409).json({ message: 'Job is closed for applications' });
  }

  const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
  if (existing) {
    return res.status(409).json({ message: 'Already applied to this job' });
  }

  const application = await Application.create({
    job: jobId,
    candidate: req.user._id
  });

  return res.status(201).json(application);
};

export const saveJob = async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedJobs: jobId } });

  return res.json({ message: 'Job saved' });
};

export const getSavedJobs = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedJobs');
  return res.json(user?.savedJobs || []);
};

export const listMyPostedJobs = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
  return res.json(jobs);
};

export const updateMyJob = async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  const allowedFields = ['title', 'company', 'location', 'description', 'skills', 'salaryRange', 'status'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
  );

  const job = await Job.findOneAndUpdate(
    { _id: jobId, recruiter: req.user._id },
    { $set: updates },
    { new: true }
  );

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  await cacheService.delByPrefix('/api/jobs').catch(() => {});

  return res.json(job);
};

export const deleteMyJob = async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }

  const job = await Job.findOneAndDelete({ _id: jobId, recruiter: req.user._id });
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  await Promise.all([
    Application.deleteMany({ job: jobId }),
    User.updateMany({ savedJobs: jobId }, { $pull: { savedJobs: jobId } })
  ]);

  await cacheService.delByPrefix('/api/jobs').catch(() => {});

  return res.json({ message: 'Job deleted' });
};
