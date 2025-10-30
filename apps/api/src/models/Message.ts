import mongoose, { Schema, Document } from 'mongoose';
import type { Message as IMessage } from '@hireloop/common';

export interface MessageDocument extends IMessage, Document {}

const messageSchema = new Schema<MessageDocument>({
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  sequenceId: { type: Schema.Types.ObjectId, ref: 'Sequence' },
  type: { type: String, enum: ['email', 'sms', 'system'], required: true },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  from: {
    email: String,
    name: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  to: [{
    email: String,
    name: String,
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate' }
  }],
  subject: String,
  body: { type: String, required: true },
  html: String,
  status: { 
    type: String, 
    enum: ['queued', 'sent', 'delivered', 'bounced', 'failed'], 
    default: 'queued' 
  },
  metadata: Schema.Types.Mixed,
  sentAt: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

messageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Message = mongoose.model<MessageDocument>('Message', messageSchema);
