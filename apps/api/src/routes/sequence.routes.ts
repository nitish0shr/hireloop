import { Router } from 'express';
import { SequenceController } from '../controllers/sequence.controller';

const router = Router();
const sequenceController = new SequenceController();

// Sequence CRUD endpoints
router.post('/', sequenceController.createSequence);
router.get('/', sequenceController.getAllSequences);
router.get('/:id', sequenceController.getSequenceById);
router.put('/:id', sequenceController.updateSequence);
router.delete('/:id', sequenceController.deleteSequence);

// Sequence execution and management
router.post('/:id/start', sequenceController.startSequence);
router.post('/:id/pause', sequenceController.pauseSequence);
router.post('/:id/resume', sequenceController.resumeSequence);
router.post('/:id/stop', sequenceController.stopSequence);

// Sequence analytics and tracking
router.get('/:id/status', sequenceController.getSequenceStatus);
router.get('/:id/analytics', sequenceController.getSequenceAnalytics);
router.get('/:id/steps', sequenceController.getSequenceSteps);

export default router;
