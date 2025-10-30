import mongoose, { Schema, Document } from 'mongoose';
import type { Event as IEvent } from '@hireloop/common';

export interface EventDocument extends IEvent, Document {}

const eventSchema = new Schema<EventDocument>({
  type: { 
    type: String, 
    enum: ['interview', 'deadline', 'reminder', 'custom'], 
    required: true 
  },
  title: { type: String, required: true },
  description: String,
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  startTime: { type: Date, required: true },
  endTime: Date,
  location: String,
  attendees: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    email: String,
    name: String,
    status: { type: String, enum: ['pending', 'accepted', 'declined'] }
  }],
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Event = mongoose.model<EventDocument>('Event', eventSchema);
