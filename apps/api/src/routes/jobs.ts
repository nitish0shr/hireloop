import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage
interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobRubric {
  criteria: Array<{
    key: string;
    description: string;
    weight: number;
  }>;
  interviewQuestions: string[];
}

let jobs: Job[] = [];
let jobRubrics: Map<string, JobRubric> = new Map();

/**
 * @route POST /v1/jobs
 * @desc Create a new job posting
 * @access Public
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, description, requirements, location } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      requirements: requirements || [],
      location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    jobs.push(job);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/jobs
 * @desc Get all job postings
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    jobs,
    total: jobs.length,
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /v1/jobs/:id
 * @desc Get a specific job posting
 * @access Public
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json(job);
});

/**
 * @route POST /v1/jobs/:id/parse
 * @desc Parse job description and generate rubric + interview questions
 * @access Public
 */
router.post('/:id/parse', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = jobs.find(j => j.id === id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Rule-based parsing (placeholder - will be enhanced with actual logic)
    const rubric: JobRubric = {
      criteria: [
        { key: 'technical_skills', description: 'Technical skills match', weight: 0.25 },
        { key: 'experience', description: 'Years of relevant experience', weight: 0.20 },
        { key: 'education', description: 'Educational background', weight: 0.15 },
        { key: 'cultural_fit', description: 'Cultural and team fit', weight: 0.15 },
        { key: 'communication', description: 'Communication skills', weight: 0.10 },
        { key: 'problem_solving', description: 'Problem-solving ability', weight: 0.10 },
        { key: 'leadership', description: 'Leadership potential', weight: 0.05 }
      ],
      interviewQuestions: [
        `Tell me about your experience with ${job.title} responsibilities?`,
        `How do you approach problem-solving in your current role?`,
        `Describe a challenging project you've worked on and how you overcame obstacles.`,
        `What interests you most about this ${job.title} position?`,
        `Where do you see yourself in the next 3-5 years?`
      ]
    };

    jobRubrics.set(id, rubric);
    
    res.json({
      jobId: id,
      rubric: rubric.criteria,
      interviewQuestions: rubric.interviewQuestions,
      parsedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse job description', message: (error as Error).message });
  }
});

export { router as jobsRouter };
