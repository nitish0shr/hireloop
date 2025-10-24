import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

// In-memory storage
interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  email: string;
  emailHash: string;
  phone?: string;
  phoneHash?: string;
  linkedInUrl?: string;
  resume?: string;
  coverLetter?: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

let applications: Application[] = [];

// Helper function to hash PII
function hashPII(value: string): string {
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

// Helper function to check for duplicates
function findDuplicate(email: string, phone?: string, linkedInUrl?: string): Application | undefined {
  const emailHash = hashPII(email);
  
  return applications.find(app => {
    if (app.emailHash === emailHash) return true;
    if (phone && app.phoneHash && app.phoneHash === hashPII(phone)) return true;
    if (linkedInUrl && app.linkedInUrl && app.linkedInUrl.toLowerCase() === linkedInUrl.toLowerCase()) return true;
    return false;
  });
}

/**
 * @route POST /v1/applications/ingest
 * @desc Ingest new application with deduplication
 * @access Public
 */
router.post('/ingest', (req: Request, res: Response) => {
  try {
    const { jobId, email, phone, linkedInUrl, resume, coverLetter } = req.body;
    
    if (!jobId || !email) {
      return res.status(400).json({ error: 'Job ID and email are required' });
    }

    // Check for duplicates
    const duplicate = findDuplicate(email, phone, linkedInUrl);
    if (duplicate) {
      return res.status(409).json({ 
        error: 'Duplicate application detected',
        existingApplicationId: duplicate.id,
        message: 'This candidate has already applied'
      });
    }

    const application: Application = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      jobId,
      candidateId: `cand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      emailHash: hashPII(email),
      phone,
      phoneHash: phone ? hashPII(phone) : undefined,
      linkedInUrl,
      resume,
      coverLetter,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    applications.push(application);
    
    // Return application without raw PII
    const { email: _, phone: __, ...safeApplication } = application;
    
    res.status(201).json({
      ...safeApplication,
      message: 'Application ingested successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest application', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/applications
 * @desc Get all applications
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  const { jobId, status } = req.query;
  
  let filtered = applications;
  
  if (jobId) {
    filtered = filtered.filter(app => app.jobId === jobId);
  }
  
  if (status) {
    filtered = filtered.filter(app => app.status === status);
  }
  
  // Return applications without raw PII
  const safeApplications = filtered.map(({ email, phone, ...app }) => app);
  
  res.json({
    applications: safeApplications,
    total: safeApplications.length,
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /v1/applications/:id
 * @desc Get a specific application
 * @access Public
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const application = applications.find(app => app.id === id);
  
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  // Return application without raw PII
  const { email, phone, ...safeApplication } = application;
  res.json(safeApplication);
});

export { router as applicationsRouter };
