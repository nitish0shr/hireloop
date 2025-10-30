import mongoose, { Schema, Document } from 'mongoose';
import type { Sequence as ISequence } from '@hireloop/common';

export interface SequenceDocument extends ISequence, Document {}

const sequenceSchema = new Schema<SequenceDocument>({
  name: { type: String, required: true },
  description: String,
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  trigger: {
    type: { type: String, enum: ['application_received', 'status_change', 'manual'], required: true },
    conditions: Schema.Types.Mixed
  },
  steps: [{
    type: { type: String, enum: ['email', 'wait', 'task'], required: true },
    delay: Number,
    templateId: String,
    subject: String,
    body: String,
    task: {
      type: String,
      assignedTo: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  }],
  isActive: { type: Boolean, default: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sequenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Sequence = mongoose.model<SequenceDocument>('Sequence', sequenceSchema);
