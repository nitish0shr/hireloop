import { Candidate, Job, MatchScore } from '@hireloop/common';
import { AppError } from '../middleware/error.middleware';

export class MatchingService {
  // ML Model stub - in production, this would be a trained model
  private modelStats = {
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.88,
    f1Score: 0.85,
    lastTrained: new Date(),
    samplesCount: 1000
  };

  // Rule-based scoring algorithm (stub for ML)
  private calculateSkillMatch(candidateSkills: string[], requiredSkills: string[], preferredSkills: string[]): number {
    const allJobSkills = [...requiredSkills, ...preferredSkills];
    if (allJobSkills.length === 0) return 0.5;
    
    const matchedRequired = requiredSkills.filter(s => candidateSkills.includes(s)).length;
    const matchedPreferred = preferredSkills.filter(s => candidateSkills.includes(s)).length;
    
    const requiredWeight = 0.7;
    const preferredWeight = 0.3;
    
    const requiredScore = requiredSkills.length > 0 ? matchedRequired / requiredSkills.length : 1;
    const preferredScore = preferredSkills.length > 0 ? matchedPreferred / preferredSkills.length : 1;
    
    return (requiredScore * requiredWeight) + (preferredScore * preferredWeight);
  }

  private calculateExperienceMatch(candidate: Candidate, job: Job): number {
    // Stub: Calculate based on years of experience
    const candidateYears = candidate.experience.reduce((sum, exp) => sum + (exp.years || 0), 0);
    const experienceLevelMap: { [key: string]: number } = {
      'entry': 1,
      'mid': 3,
      'senior': 7,
      'lead': 10
    };
    const requiredYears = experienceLevelMap[job.experienceLevel] || 3;
    
    if (candidateYears >= requiredYears) return 1.0;
    if (candidateYears >= requiredYears * 0.7) return 0.8;
    if (candidateYears >= requiredYears * 0.5) return 0.6;
    return 0.4;
  }

  private calculateLocationMatch(candidate: Candidate, job: Job): number {
    if (job.location.remote) return 1.0;
    if (!candidate.location || !job.location) return 0.5;
    
    if (candidate.location.city === job.location.city) return 1.0;
    if (candidate.location.state === job.location.state) return 0.8;
    if (candidate.location.country === job.location.country) return 0.6;
    return 0.3;
  }

  async scoreMatch(data: { candidateId: string; jobId: string; candidate?: Candidate; job?: Job }): Promise<MatchScore> {
    const { candidate, job } = data;
    
    if (!candidate || !job) {
      throw new AppError('Candidate and job data required', 400);
    }

    const skillScore = this.calculateSkillMatch(candidate.skills, job.requiredSkills, job.preferredSkills);
    const experienceScore = this.calculateExperienceMatch(candidate, job);
    const locationScore = this.calculateLocationMatch(candidate, job);
    
    // Weighted average
    const overallScore = (skillScore * 0.5) + (experienceScore * 0.3) + (locationScore * 0.2);
    
    return {
      candidateId: candidate.id,
      jobId: job.id,
      overallScore: Math.round(overallScore * 100),
      skillMatch: Math.round(skillScore * 100),
      experienceMatch: Math.round(experienceScore * 100),
      locationMatch: Math.round(locationScore * 100),
      cultureFit: Math.round(Math.random() * 30 + 70), // Stub
      breakdown: {
        technicalSkills: Math.round(skillScore * 100),
        softSkills: Math.round(Math.random() * 30 + 70),
        education: Math.round(Math.random() * 30 + 70),
        experience: Math.round(experienceScore * 100)
      },
      matchedSkills: candidate.skills.filter(s => 
        job.requiredSkills.includes(s) || job.preferredSkills.includes(s)
      ),
      missingSkills: job.requiredSkills.filter(s => !candidate.skills.includes(s)),
      strengths: ['Strong technical background', 'Relevant experience'],
      concerns: ['Location mismatch', 'Salary expectations'],
      confidence: Math.round(overallScore * 100),
      createdAt: new Date()
    };
  }

  async batchScore(data: { pairs: Array<{ candidateId: string; jobId: string; candidate?: Candidate; job?: Job }> }): Promise<MatchScore[]> {
    return Promise.all(data.pairs.map(pair => this.scoreMatch(pair)));
  }

  async getMatchedCandidates(jobId: string, filters: any): Promise<any[]> {
    // Stub: Return mock matched candidates
    return [
      { candidateId: 'cand_1', score: 92, name: 'John Doe' },
      { candidateId: 'cand_2', score: 87, name: 'Jane Smith' },
      { candidateId: 'cand_3', score: 81, name: 'Bob Johnson' }
    ];
  }

  async getMatchedJobs(candidateId: string, filters: any): Promise<any[]> {
    // Stub: Return mock matched jobs
    return [
      { jobId: 'job_1', score: 95, title: 'Senior Engineer' },
      { jobId: 'job_2', score: 88, title: 'Tech Lead' },
      { jobId: 'job_3', score: 82, title: 'Engineering Manager' }
    ];
  }

  async trainModel(data: any): Promise<any> {
    // Stub: ML model training
    this.modelStats.lastTrained = new Date();
    return {
      success: true,
      message: 'Model training initiated',
      stats: this.modelStats
    };
  }

  async evaluateModel(data: any): Promise<any> {
    // Stub: Model evaluation
    return {
      accuracy: this.modelStats.accuracy,
      metrics: this.modelStats
    };
  }

  async getModelStats(): Promise<any> {
    return this.modelStats;
  }

  async getJobRecommendations(jobId: string, filters: any): Promise<any[]> {
    // Stub: Job-based recommendations
    return this.getMatchedCandidates(jobId, filters);
  }

  async getCandidateRecommendations(candidateId: string, filters: any): Promise<any[]> {
    // Stub: Candidate-based recommendations
    return this.getMatchedJobs(candidateId, filters);
  }
}
