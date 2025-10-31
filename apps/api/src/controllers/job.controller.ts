import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';
import { AppError } from '../middleware/error.middleware';

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await this.jobService.createJob(req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };

  getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await this.jobService.getAllJobs(req.query);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (!job) {
        throw new AppError('Job not found', 404);
      }
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await this.jobService.updateJob(req.params.id, req.body);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.jobService.deleteJob(req.params.id);
      res.status(200).json({ success: true, message: 'Job deleted' });
    } catch (error) {
      next(error);
    }
  };

  searchJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await this.jobService.searchJobs(req.body);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  getJobsByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await this.jobService.getJobsByStatus(req.params.status);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  getJobsByDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await this.jobService.getJobsByDepartment(req.params.department);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  getJobCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.jobService.getJobCandidates(req.params.id);
      res.status(200).json({ success: true, data: candidates });
    } catch (error) {
      next(error);
    }
  };

  publishJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await this.jobService.publishJob(req.params.id);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };

  closeJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await this.jobService.closeJob(req.params.id);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };
}
