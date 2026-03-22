import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    company: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    description: { type: String, trim: true }
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, trim: true },
    degree: { type: String, trim: true },
    field: { type: String, trim: true },
    startYear: { type: String, trim: true },
    endYear: { type: String, trim: true }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    headline: { type: String, trim: true, default: '' },
    about: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    photoUrl: { type: String, trim: true, default: '' },
    bannerUrl: { type: String, trim: true, default: '' },
    visibility: { type: String, enum: ['public', 'connections', 'private'], default: 'public' },
    skills: [{ type: String, trim: true }],
    experience: [experienceSchema],
    education: [educationSchema]
  },
  { timestamps: true }
);

profileSchema.index({ skills: 1, location: 1 });

export default mongoose.model('Profile', profileSchema);
