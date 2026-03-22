import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    salaryRange: { type: String, trim: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

jobSchema.index({ title: 1, location: 1, company: 1 });

export default mongoose.model('Job', jobSchema);
