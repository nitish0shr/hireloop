import { Router } from 'express';
import { MatchingController } from '../controllers/matching.controller';

const router = Router();
const matchingController = new MatchingController();

// Matching and scoring endpoints
router.post('/score', matchingController.scoreMatch);
router.post('/batch-score', matchingController.batchScore);
router.get('/job/:jobId/candidates', matchingController.getMatchedCandidates);
router.get('/candidate/:candidateId/jobs', matchingController.getMatchedJobs);

// ML matching operations
router.post('/train', matchingController.trainModel);
router.post('/evaluate', matchingController.evaluateModel);
router.get('/model/stats', matchingController.getModelStats);

// Recommendations
router.get('/job/:jobId/recommendations', matchingController.getJobRecommendations);
router.get('/candidate/:candidateId/recommendations', matchingController.getCandidateRecommendations);

export default router;
