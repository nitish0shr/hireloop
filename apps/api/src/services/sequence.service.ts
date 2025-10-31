import { Sequence, SequenceStep } from '@hireloop/common';
import { AppError } from '../middleware/error.middleware';

export class SequenceService {
  // In-memory store (replace with DB later)
  private sequences: Map<string, Sequence> = new Map();
  private idCounter = 1;

  async createSequence(data: Partial<Sequence>): Promise<Sequence> {
    const id = `seq_${this.idCounter++}`;
    const sequence: Sequence = {
      id,
      name: data.name || '',
      description: data.description,
      type: data.type || 'email',
      status: data.status || 'draft',
      steps: data.steps || [],
      targetType: data.targetType || 'candidate',
      targetIds: data.targetIds || [],
      triggerEvent: data.triggerEvent,
      schedule: data.schedule,
      stats: data.stats || {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        bounced: 0
      },
      createdBy: data.createdBy || 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sequences.set(id, sequence);
    return sequence;
  }

  async getAllSequences(filters: any): Promise<Sequence[]> {
    return Array.from(this.sequences.values());
  }

  async getSequenceById(id: string): Promise<Sequence | undefined> {
    return this.sequences.get(id);
  }

  async updateSequence(id: string, data: Partial<Sequence>): Promise<Sequence> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    const updated = { ...sequence, ...data, updatedAt: new Date() };
    this.sequences.set(id, updated);
    return updated;
  }

  async deleteSequence(id: string): Promise<void> {
    if (!this.sequences.has(id)) {
      throw new AppError('Sequence not found', 404);
    }
    this.sequences.delete(id);
  }

  async startSequence(id: string): Promise<any> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    sequence.status = 'active';
    sequence.updatedAt = new Date();
    return { success: true, message: 'Sequence started', sequence };
  }

  async pauseSequence(id: string): Promise<any> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    sequence.status = 'paused';
    sequence.updatedAt = new Date();
    return { success: true, message: 'Sequence paused', sequence };
  }

  async resumeSequence(id: string): Promise<any> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    sequence.status = 'active';
    sequence.updatedAt = new Date();
    return { success: true, message: 'Sequence resumed', sequence };
  }

  async stopSequence(id: string): Promise<any> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    sequence.status = 'stopped';
    sequence.updatedAt = new Date();
    return { success: true, message: 'Sequence stopped', sequence };
  }

  async getSequenceStatus(id: string): Promise<any> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    return {
      id: sequence.id,
      status: sequence.status,
      currentStep: sequence.steps.length > 0 ? sequence.steps[0].id : null,
      stats: sequence.stats
    };
  }

  async getSequenceAnalytics(id: string): Promise<any> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    return {
      id: sequence.id,
      name: sequence.name,
      stats: sequence.stats,
      engagement: {
        openRate: sequence.stats.sent > 0 ? (sequence.stats.opened / sequence.stats.sent) * 100 : 0,
        clickRate: sequence.stats.sent > 0 ? (sequence.stats.clicked / sequence.stats.sent) * 100 : 0,
        replyRate: sequence.stats.sent > 0 ? (sequence.stats.replied / sequence.stats.sent) * 100 : 0
      }
    };
  }

  async getSequenceSteps(id: string): Promise<SequenceStep[]> {
    const sequence = this.sequences.get(id);
    if (!sequence) {
      throw new AppError('Sequence not found', 404);
    }
    return sequence.steps;
  }
}
