import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

// Dashboard analytics
router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/overview', analyticsController.getOverview);

// Candidate analytics
router.get('/candidates/stats', analyticsController.getCandidateStats);
router.get('/candidates/pipeline', analyticsController.getCandidatePipeline);
router.get('/candidates/conversion', analyticsController.getCandidateConversion);

// Job analytics
router.get('/jobs/stats', analyticsController.getJobStats);
router.get('/jobs/performance', analyticsController.getJobPerformance);
router.get('/jobs/time-to-fill', analyticsController.getTimeToFill);

// Matching analytics
router.get('/matching/accuracy', analyticsController.getMatchingAccuracy);
router.get('/matching/performance', analyticsController.getMatchingPerformance);

// Sequence analytics
router.get('/sequences/engagement', analyticsController.getSequenceEngagement);
router.get('/sequences/performance', analyticsController.getSequencePerformance);

export default router;
