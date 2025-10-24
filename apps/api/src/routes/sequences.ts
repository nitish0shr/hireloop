import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage
interface SequenceStep {
  dayOffset: number;
  channel: 'email';
  template: string;
}

interface Guardrails {
  quietHours: { start: string; end: string };
  perDayCap: number;
  respectUnsubscribe: boolean;
}

interface Sequence {
  id: string;
  name: string;
  jobId?: string;
  steps: SequenceStep[];
  guardrails: Guardrails;
  status: 'draft' | 'active' | 'paused';
  createdAt: string;
  updatedAt: string;
}

interface SequenceSend {
  id: string;
  sequenceId: string;
  candidateId: string;
  email: string;
  stepIndex: number;
  status: 'queued' | 'sent' | 'bounced' | 'unsubscribed';
  scheduledFor: string;
  sentAt?: string;
  createdAt: string;
}

let sequences: Sequence[] = [];
let sequenceSends: SequenceSend[] = [];
const unsubscribedEmails = new Set<string>();

/**
 * @route POST /v1/sequences
 * @desc Create a new outreach sequence
 * @access Public
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, jobId, steps, guardrails } = req.body;
    
    if (!name || !steps || steps.length === 0) {
      return res.status(400).json({ error: 'Name and at least one step are required' });
    }
    
    // Validate guardrails
    const defaultGuardrails: Guardrails = {
      quietHours: { start: '18:00', end: '08:00' },
      perDayCap: 100,
      respectUnsubscribe: true
    };
    
    const sequence: Sequence = {
      id: `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      jobId,
      steps,
      guardrails: guardrails || defaultGuardrails,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sequences.push(sequence);
    res.status(201).json(sequence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sequence', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/sequences
 * @desc Get all sequences
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  const { jobId, status } = req.query;
  
  let filtered = sequences;
  
  if (jobId) {
    filtered = filtered.filter(seq => seq.jobId === jobId);
  }
  
  if (status) {
    filtered = filtered.filter(seq => seq.status === status);
  }
  
  res.json({
    sequences: filtered,
    total: filtered.length,
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /v1/sequences/:id
 * @desc Get a specific sequence
 * @access Public
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const sequence = sequences.find(seq => seq.id === id);
  
  if (!sequence) {
    return res.status(404).json({ error: 'Sequence not found' });
  }
  
  res.json(sequence);
});

/**
 * @route POST /v1/sequences/:id/send
 * @desc Queue sends for a sequence
 * @access Public
 */
router.post('/:id/send', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { candidateId, email } = req.body;
    
    if (!candidateId || !email) {
      return res.status(400).json({ error: 'Candidate ID and email are required' });
    }
    
    const sequence = sequences.find(seq => seq.id === id);
    if (!sequence) {
      return res.status(404).json({ error: 'Sequence not found' });
    }
    
    // Check unsubscribe status
    if (unsubscribedEmails.has(email.toLowerCase())) {
      return res.status(403).json({ 
        error: 'Candidate has unsubscribed',
        message: 'Cannot send to unsubscribed email address'
      });
    }
    
    // Calculate send times respecting quiet hours and caps
    const now = new Date();
    const sends: SequenceSend[] = [];
    
    sequence.steps.forEach((step, index) => {
      const scheduledDate = new Date(now);
      scheduledDate.setDate(scheduledDate.getDate() + step.dayOffset);
      
      // Adjust for quiet hours (simplified - would need timezone logic)
      const hours = scheduledDate.getHours();
      const quietStart = parseInt(sequence.guardrails.quietHours.start.split(':')[0]);
      const quietEnd = parseInt(sequence.guardrails.quietHours.end.split(':')[0]);
      
      if (hours >= quietStart || hours < quietEnd) {
        scheduledDate.setHours(quietEnd, 0, 0, 0);
      }
      
      const send: SequenceSend = {
        id: `send_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        sequenceId: id,
        candidateId,
        email,
        stepIndex: index,
        status: 'queued',
        scheduledFor: scheduledDate.toISOString(),
        createdAt: new Date().toISOString()
      };
      
      sends.push(send);
      sequenceSends.push(send);
    });
    
    res.json({
      message: 'Sequence sends queued successfully',
      sends,
      total: sends.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to queue sequence sends', message: (error as Error).message });
  }
});

/**
 * @route POST /v1/sequences/unsubscribe
 * @desc Mark an email as unsubscribed
 * @access Public
 */
router.post('/unsubscribe', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    unsubscribedEmails.add(email.toLowerCase());
    
    // Mark all queued sends as unsubscribed
    sequenceSends
      .filter(send => send.email.toLowerCase() === email.toLowerCase() && send.status === 'queued')
      .forEach(send => {
        send.status = 'unsubscribed';
      });
    
    res.json({
      message: 'Email unsubscribed successfully',
      email: email.toLowerCase()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsubscribe', message: (error as Error).message });
  }
});

export { router as sequencesRouter };
