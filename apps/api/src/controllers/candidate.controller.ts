import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { AppError } from '../middleware/error.middleware';

export class CandidateController {
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService();
  }

  createCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidate = await this.candidateService.createCandidate(req.body);
      res.status(201).json({ success: true, data: candidate });
    } catch (error) {
      next(error);
    }
  };

  getAllCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.candidateService.getAllCandidates(req.query);
      res.status(200).json({ success: true, data: candidates });
    } catch (error) {
      next(error);
    }
  };

  getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidate = await this.candidateService.getCandidateById(req.params.id);
      if (!candidate) {
        throw new AppError('Candidate not found', 404);
      }
      res.status(200).json({ success: true, data: candidate });
    } catch (error) {
      next(error);
    }
  };

  updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidate = await this.candidateService.updateCandidate(req.params.id, req.body);
      res.status(200).json({ success: true, data: candidate });
    } catch (error) {
      next(error);
    }
  };

  deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.candidateService.deleteCandidate(req.params.id);
      res.status(200).json({ success: true, message: 'Candidate deleted' });
    } catch (error) {
      next(error);
    }
  };

  searchCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.candidateService.searchCandidates(req.body);
      res.status(200).json({ success: true, data: candidates });
    } catch (error) {
      next(error);
    }
  };

  getCandidatesBySkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.candidateService.getCandidatesBySkill(req.params.skill);
      res.status(200).json({ success: true, data: candidates });
    } catch (error) {
      next(error);
    }
  };

  getCandidatesByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.candidateService.getCandidatesByStatus(req.params.status);
      res.status(200).json({ success: true, data: candidates });
    } catch (error) {
      next(error);
    }
  };

  enrichCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidate = await this.candidateService.enrichCandidateProfile(req.params.id);
      res.status(200).json({ success: true, data: candidate });
    } catch (error) {
      next(error);
    }
  };

  uploadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.candidateService.uploadResume(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
