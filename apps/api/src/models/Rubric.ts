import mongoose, { Schema, Document } from 'mongoose';
import type { Rubric as IRubric } from '@hireloop/common';

export interface RubricDocument extends IRubric, Document {}

const rubricSchema = new Schema<RubricDocument>({
  name: { type: String, required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  criteria: [{
    name: { type: String, required: true },
    description: String,
    weight: { type: Number, default: 1 },
    scoreRange: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 5 }
    }
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

rubricSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Rubric = mongoose.model<RubricDocument>('Rubric', rubricSchema);
