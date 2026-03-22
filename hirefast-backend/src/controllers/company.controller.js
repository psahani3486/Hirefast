import mongoose from 'mongoose';
import Company from '../models/Company.js';
import Job from '../models/Job.js';

export const listCompanies = async (req, res) => {
  const q = (req.query.q || '').toString().trim();

  const items = await Company.find(
    q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { industry: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
          ]
        }
      : {}
  )
    .populate('owner', 'name email role')
    .sort({ createdAt: -1 })
    .limit(50);

  return res.json(items);
};

export const createCompany = async (req, res) => {
  const { name, description, website, industry, size, location, logoUrl } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  const company = await Company.create({
    name: name.trim(),
    description: description?.trim() || '',
    website: website?.trim() || '',
    industry: industry?.trim() || '',
    size: size?.trim() || '',
    location: location?.trim() || '',
    logoUrl: logoUrl?.trim() || '',
    owner: req.user._id
  });

  await company.populate('owner', 'name email role');
  return res.status(201).json(company);
};

export const updateMyCompany = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid company id' });
  }

  const allowed = ['name', 'description', 'website', 'industry', 'size', 'location', 'logoUrl'];
  const updates = Object.fromEntries(
    Object.entries(req.body)
      .filter(([key]) => allowed.includes(key))
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  );

  const company = await Company.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { $set: updates },
    { new: true }
  ).populate('owner', 'name email role');

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  return res.json(company);
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid company id' });
  }

  const company = await Company.findById(id).populate('owner', 'name email role');
  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  const jobs = await Job.find({ company: company.name, status: 'open' })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('recruiter', 'name email role');

  return res.json({ company, jobs });
};
