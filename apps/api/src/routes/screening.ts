import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage for screening results
interface ScreeningResult {
  id: string;
  applicationId: string;
  score: number;
  label: 'Strong' | 'Consider' | 'Not';
  reasons: string[];
  breakdown: {
    skills: number;
    experience: number;
    education: number;
    location: number;
    visa: number;
  };
  screenedAt: string;
}

let screeningResults: ScreeningResult[] = [];

// Helper function to calculate screening score (rules-based heuristics)
function calculateScreeningScore(application: any, job: any): ScreeningResult {
  const scores = {
    skills: 0,
    experience: 0,
    education: 0,
    location: 0,
    visa: 0
  };
  
  const reasons: string[] = [];
  
  // Skills matching (placeholder logic - would be enhanced with real parsing)
  const resumeText = application.resume?.toLowerCase() || '';
  const requiredSkills = job?.requirements || [];
  
  let matchedSkills = 0;
  requiredSkills.forEach((skill: string) => {
    if (resumeText.includes(skill.toLowerCase())) {
      matchedSkills++;
    }
  });
  
  if (requiredSkills.length > 0) {
    scores.skills = Math.min(100, (matchedSkills / requiredSkills.length) * 100);
  } else {
    scores.skills = 70; // Default if no requirements specified
  }
  
  if (scores.skills >= 80) {
    reasons.push('Strong skills match');
  } else if (scores.skills < 50) {
    reasons.push('Skills gap identified');
  }
  
  // Experience heuristic (simple keyword search)
  const experienceKeywords = ['years', 'experience', 'led', 'managed', 'developed', 'built'];
  const experienceMatches = experienceKeywords.filter(kw => resumeText.includes(kw)).length;
  scores.experience = Math.min(100, experienceMatches * 20);
  
  if (scores.experience >= 80) {
    reasons.push('Strong experience indicators');
  } else if (scores.experience < 40) {
    reasons.push('Limited experience signals');
  }
  
  // Education heuristic
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
  const educationMatches = educationKeywords.filter(kw => resumeText.includes(kw)).length;
  scores.education = Math.min(100, educationMatches * 25);
  
  if (scores.education >= 75) {
    reasons.push('Relevant educational background');
  }
  
  // Location (default - would integrate with actual job location requirements)
  scores.location = 80;
  
  // Visa status (default - would need actual data)
  scores.visa = 100;
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    scores.skills * 0.40 +
    scores.experience * 0.30 +
    scores.education * 0.15 +
    scores.location * 0.10 +
    scores.visa * 0.05
  );
  
  // Determine label based on score
  let label: 'Strong' | 'Consider' | 'Not';
  if (overallScore >= 75) {
    label = 'Strong';
    reasons.push('Overall strong candidate profile');
  } else if (overallScore >= 50) {
    label = 'Consider';
    reasons.push('Meets basic requirements, needs review');
  } else {
    label = 'Not';
    reasons.push('Does not meet minimum requirements');
  }
  
  return {
    id: `screen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    applicationId: application.id,
    score: overallScore,
    label,
    reasons,
    breakdown: scores,
    screenedAt: new Date().toISOString()
  };
}

/**
 * @route POST /v1/screen
 * @desc Screen a candidate application
 * @access Public
 */
router.post('/screen', (req: Request, res: Response) => {
  try {
    const { applicationId, application, job } = req.body;
    
    if (!applicationId && !application) {
      return res.status(400).json({ error: 'Application ID or application data is required' });
    }
    
    // Check if already screened
    const existing = screeningResults.find(sr => sr.applicationId === applicationId);
    if (existing) {
      return res.json({
        ...existing,
        message: 'Application was already screened (cached result)'
      });
    }
    
    // Perform screening
    const result = calculateScreeningScore(application, job);
    screeningResults.push(result);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to screen application', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/screen/:applicationId
 * @desc Get screening result for an application
 * @access Public
 */
router.get('/screen/:applicationId', (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const result = screeningResults.find(sr => sr.applicationId === applicationId);
  
  if (!result) {
    return res.status(404).json({ error: 'Screening result not found' });
  }
  
  res.json(result);
});

export { router as screeningRouter };
