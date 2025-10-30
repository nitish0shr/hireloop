import mongoose, { Schema, Document } from 'mongoose';
import type { Application as IApplication } from '@hireloop/common';

export interface ApplicationDocument extends IApplication, Document {}

const applicationSchema = new Schema<ApplicationDocument>({
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { 
    type: String, 
    enum: ['applied', 'screening', 'interviewing', 'offer', 'hired', 'rejected', 'withdrawn'], 
    default: 'applied' 
  },
  stage: String,
  source: String,
  coverLetter: String,
  answers: [{
    questionId: String,
    question: String,
    answer: String
  }],
  scores: [{
    rubricId: { type: Schema.Types.ObjectId, ref: 'Rubric' },
    evaluatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    scores: [{
      criteriaId: String,
      score: Number,
      notes: String
    }],
    totalScore: Number,
    evaluatedAt: Date
  }],
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  notes: String,
  appliedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Application = mongoose.model<ApplicationDocument>('Application', applicationSchema);
