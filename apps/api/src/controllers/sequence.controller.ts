import { Request, Response, NextFunction } from 'express';
import { SequenceService } from '../services/sequence.service';
import { AppError } from '../middleware/error.middleware';

export class SequenceController {
  private sequenceService: SequenceService;

  constructor() {
    this.sequenceService = new SequenceService();
  }

  createSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sequence = await this.sequenceService.createSequence(req.body);
      res.status(201).json({ success: true, data: sequence });
    } catch (error) {
      next(error);
    }
  };

  getAllSequences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sequences = await this.sequenceService.getAllSequences(req.query);
      res.status(200).json({ success: true, data: sequences });
    } catch (error) {
      next(error);
    }
  };

  getSequenceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sequence = await this.sequenceService.getSequenceById(req.params.id);
      if (!sequence) {
        throw new AppError('Sequence not found', 404);
      }
      res.status(200).json({ success: true, data: sequence });
    } catch (error) {
      next(error);
    }
  };

  updateSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sequence = await this.sequenceService.updateSequence(req.params.id, req.body);
      res.status(200).json({ success: true, data: sequence });
    } catch (error) {
      next(error);
    }
  };

  deleteSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.sequenceService.deleteSequence(req.params.id);
      res.status(200).json({ success: true, message: 'Sequence deleted' });
    } catch (error) {
      next(error);
    }
  };

  startSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sequenceService.startSequence(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  pauseSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sequenceService.pauseSequence(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  resumeSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sequenceService.resumeSequence(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  stopSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.sequenceService.stopSequence(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getSequenceStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = await this.sequenceService.getSequenceStatus(req.params.id);
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  };

  getSequenceAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.sequenceService.getSequenceAnalytics(req.params.id);
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  };

  getSequenceSteps = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const steps = await this.sequenceService.getSequenceSteps(req.params.id);
      res.status(200).json({ success: true, data: steps });
    } catch (error) {
      next(error);
    }
  };
}
