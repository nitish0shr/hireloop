import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';

const router = Router();
const candidateController = new CandidateController();

// Candidate CRUD endpoints
router.post('/', candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

// Candidate search and filtering
router.post('/search', candidateController.searchCandidates);
router.get('/skills/:skill', candidateController.getCandidatesBySkill);
router.get('/status/:status', candidateController.getCandidatesByStatus);

// Candidate profile enrichment
router.post('/:id/enrich', candidateController.enrichCandidateProfile);
router.post('/:id/upload-resume', candidateController.uploadResume);

export default router;
