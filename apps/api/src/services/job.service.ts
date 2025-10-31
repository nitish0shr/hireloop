import { Job } from '@hireloop/common';
import { AppError } from '../middleware/error.middleware';

export class JobService {
  // In-memory store (replace with DB later)
  private jobs: Map<string, Job> = new Map();
  private idCounter = 1;

  async createJob(data: Partial<Job>): Promise<Job> {
    const id = `job_${this.idCounter++}`;
    const job: Job = {
      id,
      title: data.title || '',
      description: data.description || '',
      department: data.department,
      location: data.location || { city: '', state: '', country: '', remote: false },
      type: data.type || 'full-time',
      status: data.status || 'draft',
      requiredSkills: data.requiredSkills || [],
      preferredSkills: data.preferredSkills || [],
      experienceLevel: data.experienceLevel || 'mid',
      salaryRange: data.salaryRange,
      benefits: data.benefits || [],
      requirements: data.requirements || [],
      responsibilities: data.responsibilities || [],
      hiringManager: data.hiringManager,
      openings: data.openings || 1,
      applicants: data.applicants || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async getAllJobs(filters: any): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJobById(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    const updated = { ...job, ...data, updatedAt: new Date() };
    this.jobs.set(id, updated);
    return updated;
  }

  async deleteJob(id: string): Promise<void> {
    if (!this.jobs.has(id)) {
      throw new AppError('Job not found', 404);
    }
    this.jobs.delete(id);
  }

  async searchJobs(criteria: any): Promise<Job[]> {
    const allJobs = Array.from(this.jobs.values());
    return allJobs.filter(j => {
      if (criteria.skills && criteria.skills.length > 0) {
        return criteria.skills.some((skill: string) => 
          j.requiredSkills.includes(skill) || j.preferredSkills.includes(skill)
        );
      }
      return true;
    });
  }

  async getJobsByStatus(status: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(j => j.status === status);
  }

  async getJobsByDepartment(department: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(j => j.department === department);
  }

  async getJobCandidates(id: string): Promise<any[]> {
    const job = this.jobs.get(id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    return job.applicants || [];
  }

  async publishJob(id: string): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    job.status = 'active';
    job.updatedAt = new Date();
    return job;
  }

  async closeJob(id: string): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    job.status = 'closed';
    job.updatedAt = new Date();
    return job;
  }
}
