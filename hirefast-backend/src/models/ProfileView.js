import mongoose from 'mongoose';

const profileViewSchema = new mongoose.Schema(
  {
    profileOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

profileViewSchema.index({ profileOwner: 1, createdAt: -1 });
profileViewSchema.index({ profileOwner: 1, viewer: 1, createdAt: -1 });

export default mongoose.model('ProfileView', profileViewSchema);
