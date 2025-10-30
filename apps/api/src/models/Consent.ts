import mongoose, { Schema, Document } from 'mongoose';
import type { Consent as IConsent } from '@hireloop/common';

export interface ConsentDocument extends IConsent, Document {}

const consentSchema = new Schema<ConsentDocument>({
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  type: { 
    type: String, 
    enum: ['gdpr', 'background_check', 'drug_test', 'terms', 'custom'], 
    required: true 
  },
  granted: { type: Boolean, required: true },
  grantedAt: Date,
  revokedAt: Date,
  ipAddress: String,
  userAgent: String,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export const Consent = mongoose.model<ConsentDocument>('Consent', consentSchema);
