import mongoose, { Schema, Document } from 'mongoose';
import type { Organization as IOrganization } from '@hireloop/common';

export interface OrganizationDocument extends IOrganization, Document {}

const organizationSchema = new Schema<OrganizationDocument>({
  name: { type: String, required: true },
  settings: {
    branding: {
      logo: String,
      primaryColor: String
    },
    emailDomain: String,
    defaultTimezone: String
  },
  subscription: {
    plan: { type: String, enum: ['free', 'startup', 'business', 'enterprise'], required: true },
    status: { type: String, enum: ['active', 'cancelled', 'past_due'], required: true },
    currentPeriodEnd: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

organizationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Organization = mongoose.model<OrganizationDocument>('Organization', organizationSchema);
