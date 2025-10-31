import { Request, Response, NextFunction } from 'express';
import { MatchingService } from '../services/matching.service';
import { AppError } from '../middleware/error.middleware';

export class MatchingController {
  private matchingService: MatchingService;

  constructor() {
    this.matchingService = new MatchingService();
  }

  scoreMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const score = await this.matchingService.scoreMatch(req.body);
      res.status(200).json({ success: true, data: score });
    } catch (error) {
      next(error);
    }
  };

  batchScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scores = await this.matchingService.batchScore(req.body);
      res.status(200).json({ success: true, data: scores });
    } catch (error) {
      next(error);
    }
  };

  getMatchedCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.matchingService.getMatchedCandidates(req.params.jobId, req.query);
      res.status(200).json({ success: true, data: candidates });
    } catch (error) {
      next(error);
    }
  };

  getMatchedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await this.matchingService.getMatchedJobs(req.params.candidateId, req.query);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  };

  trainModel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.matchingService.trainModel(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  evaluateModel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const evaluation = await this.matchingService.evaluateModel(req.body);
      res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
      next(error);
    }
  };

  getModelStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.matchingService.getModelStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getJobRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recommendations = await this.matchingService.getJobRecommendations(req.params.jobId, req.query);
      res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
      next(error);
    }
  };

  getCandidateRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recommendations = await this.matchingService.getCandidateRecommendations(req.params.candidateId, req.query);
      res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
      next(error);
    }
  };
}
