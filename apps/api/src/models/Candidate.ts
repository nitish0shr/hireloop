import mongoose, { Schema, Document } from 'mongoose';
import type { Candidate as ICandidate } from '@hireloop/common';

export interface CandidateDocument extends ICandidate, Document {}

const candidateSchema = new Schema<CandidateDocument>({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  resume: {
    url: String,
    filename: String,
    uploadedAt: Date
  },
  linkedin: String,
  github: String,
  portfolio: String,
  source: { type: String, enum: ['applied', 'referral', 'sourced', 'agency'] },
  tags: [String],
  notes: String,
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

candidateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Candidate = mongoose.model<CandidateDocument>('Candidate', candidateSchema);
