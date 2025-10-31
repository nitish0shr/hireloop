import { Router } from 'express';
import { JobController } from '../controllers/job.controller';

const router = Router();
const jobController = new JobController();

// Job CRUD endpoints
router.post('/', jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

// Job search and filtering
router.post('/search', jobController.searchJobs);
router.get('/status/:status', jobController.getJobsByStatus);
router.get('/department/:department', jobController.getJobsByDepartment);

// Job-specific operations
router.get('/:id/candidates', jobController.getJobCandidates);
router.post('/:id/publish', jobController.publishJob);
router.post('/:id/close', jobController.closeJob);

export default router;
