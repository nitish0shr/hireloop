import mongoose, { Schema, Document } from 'mongoose';
import type { Job as IJob } from '@hireloop/common';

export interface JobDocument extends IJob, Document {}

const jobSchema = new Schema<JobDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: String,
  location: {
    city: String,
    state: String,
    country: String,
    remote: Boolean
  },
  employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true },
  experienceLevel: { type: String, enum: ['entry', 'mid', 'senior', 'lead'] },
  salaryRange: {
    min: Number,
    max: Number,
    currency: String
  },
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  hiringManagerId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'published', 'closed', 'archived'], default: 'draft' },
  openings: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: Date,
  closedAt: Date
});

jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Job = mongoose.model<JobDocument>('Job', jobSchema);
