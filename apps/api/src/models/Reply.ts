import mongoose, { Schema, Document } from 'mongoose';
import type { Reply as IReply } from '@hireloop/common';

export interface ReplyDocument extends IReply, Document {}

const replySchema = new Schema<ReplyDocument>({
  messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  from: {
    email: String,
    name: String,
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate' }
  },
  body: { type: String, required: true },
  html: String,
  receivedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const Reply = mongoose.model<ReplyDocument>('Reply', replySchema);
