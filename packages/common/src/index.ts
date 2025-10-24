// Shared types for the Hireloop platform

export type JobStatus = 'draft' | 'open' | 'closed';
export type ApplicationStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type CandidateLabel = 'Strong' | 'Consider' | 'Not';
export type ReplyClassification = 'Yes' | 'Maybe' | 'No';
export type MessageChannel = 'email' | 'sms';

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  status: JobStatus;
  rubric?: Rubric;
  interviewQuestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Rubric {
  keys: RubricKey[];
}

export interface RubricKey {
  name: string;
  description: string;
  weight: number; // 0-1, sum of all weights should be 1
}

export interface Candidate {
  id: string;
  organizationId: string;
  emailHash: string; // hashed
  phoneHash?: string; // hashed
  name: string;
  linkedInUrl?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  label?: CandidateLabel;
  score?: number; // 0-100
  scoringReasons?: string[];
  screenedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sequence {
  id: string;
  organizationId: string;
  name: string;
  steps: SequenceStep[];
  guardrails: Guardrails;
  createdAt: Date;
  updatedAt: Date;
}

export interface SequenceStep {
  dayOffset: number;
  channel: MessageChannel;
  template: string;
}

export interface Guardrails {
  quietHours: { start: number; end: number }; // 0-23
  perDayCap: number;
}

export interface Message {
  id: string;
  sequenceId: string;
  candidateId: string;
  channel: MessageChannel;
  content: string;
  sentAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  id: string;
  candidateId: string;
  rawContent: string;
  classification?: ReplyClassification;
  confidence?: number; // 0-1
  needsReview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  applicationId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  calendarEventId?: string; // Google Calendar event ID
  icsData?: string; // fallback ICS data
  createdAt: Date;
  updatedAt: Date;
}

export interface Consent {
  id: string;
  candidateId: string;
  consentType: 'email' | 'sms' | 'data_processing';
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface FunnelMetrics {
  jobsCount: number;
  candidatesCount: number;
  applicationsCount: number;
  labelCounts: {
    Strong: number;
    Consider: number;
    Not: number;
  };
  avgTimeToFirstInterview?: number; // in days
}
