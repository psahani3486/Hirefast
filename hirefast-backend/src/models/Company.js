import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    industry: { type: String, trim: true, default: '' },
    size: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    logoUrl: { type: String, trim: true, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

companySchema.index({ name: 1 });
companySchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model('Company', companySchema);
