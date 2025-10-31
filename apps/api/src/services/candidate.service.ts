import { Candidate } from '@hireloop/common';
import { AppError } from '../middleware/error.middleware';

export class CandidateService {
  // In-memory store (replace with DB later)
  private candidates: Map<string, Candidate> = new Map();
  private idCounter = 1;

  async createCandidate(data: Partial<Candidate>): Promise<Candidate> {
    const id = `cand_${this.idCounter++}`;
    const candidate: Candidate = {
      id,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      location: data.location,
      skills: data.skills || [],
      experience: data.experience || [],
      education: data.education || [],
      status: data.status || 'new',
      appliedJobs: data.appliedJobs || [],
      tags: data.tags || [],
      source: data.source,
      notes: data.notes,
      resumeUrl: data.resumeUrl,
      profileUrl: data.profileUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.candidates.set(id, candidate);
    return candidate;
  }

  async getAllCandidates(filters: any): Promise<Candidate[]> {
    return Array.from(this.candidates.values());
  }

  async getCandidateById(id: string): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.candidates.get(id);
    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }
    const updated = { ...candidate, ...data, updatedAt: new Date() };
    this.candidates.set(id, updated);
    return updated;
  }

  async deleteCandidate(id: string): Promise<void> {
    if (!this.candidates.has(id)) {
      throw new AppError('Candidate not found', 404);
    }
    this.candidates.delete(id);
  }

  async searchCandidates(criteria: any): Promise<Candidate[]> {
    const allCandidates = Array.from(this.candidates.values());
    return allCandidates.filter(c => {
      if (criteria.skills && criteria.skills.length > 0) {
        return criteria.skills.some((skill: string) => c.skills.includes(skill));
      }
      return true;
    });
  }

  async getCandidatesBySkill(skill: string): Promise<Candidate[]> {
    return Array.from(this.candidates.values()).filter(c => c.skills.includes(skill));
  }

  async getCandidatesByStatus(status: string): Promise<Candidate[]> {
    return Array.from(this.candidates.values()).filter(c => c.status === status);
  }

  async enrichCandidateProfile(id: string): Promise<Candidate> {
    const candidate = this.candidates.get(id);
    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }
    // Stub: In real implementation, call external APIs to enrich profile
    return candidate;
  }

  async uploadResume(id: string, data: any): Promise<any> {
    const candidate = this.candidates.get(id);
    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }
    // Stub: In real implementation, handle file upload and parsing
    candidate.resumeUrl = data.resumeUrl || 'uploaded-resume-url';
    return { success: true, resumeUrl: candidate.resumeUrl };
  }
}
