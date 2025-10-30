import mongoose, { Schema, Document } from 'mongoose';
import type { User as IUser } from '@hireloop/common';

export interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'recruiter', 'hiring_manager', 'interviewer'], required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  passwordHash: { type: String, required: true },
  profile: {
    avatar: String,
    title: String,
    department: String
  },
  permissions: [String],
  lastLoginAt: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<UserDocument>('User', userSchema);
