import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AppError } from '../middleware/error.middleware';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.analyticsService.getDashboardStats(req.query);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const overview = await this.analyticsService.getOverview(req.query);
      res.status(200).json({ success: true, data: overview });
    } catch (error) {
      next(error);
    }
  };

  getCandidateStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.analyticsService.getCandidateStats(req.query);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getCandidatePipeline = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pipeline = await this.analyticsService.getCandidatePipeline(req.query);
      res.status(200).json({ success: true, data: pipeline });
    } catch (error) {
      next(error);
    }
  };

  getCandidateConversion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversion = await this.analyticsService.getCandidateConversion(req.query);
      res.status(200).json({ success: true, data: conversion });
    } catch (error) {
      next(error);
    }
  };

  getJobStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.analyticsService.getJobStats(req.query);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getJobPerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performance = await this.analyticsService.getJobPerformance(req.query);
      res.status(200).json({ success: true, data: performance });
    } catch (error) {
      next(error);
    }
  };

  getTimeToFill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const timeToFill = await this.analyticsService.getTimeToFill(req.query);
      res.status(200).json({ success: true, data: timeToFill });
    } catch (error) {
      next(error);
    }
  };

  getMatchingAccuracy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accuracy = await this.analyticsService.getMatchingAccuracy(req.query);
      res.status(200).json({ success: true, data: accuracy });
    } catch (error) {
      next(error);
    }
  };

  getMatchingPerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performance = await this.analyticsService.getMatchingPerformance(req.query);
      res.status(200).json({ success: true, data: performance });
    } catch (error) {
      next(error);
    }
  };

  getSequenceEngagement = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const engagement = await this.analyticsService.getSequenceEngagement(req.query);
      res.status(200).json({ success: true, data: engagement });
    } catch (error) {
      next(error);
    }
  };

  getSequencePerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performance = await this.analyticsService.getSequencePerformance(req.query);
      res.status(200).json({ success: true, data: performance });
    } catch (error) {
      next(error);
    }
  };
}
