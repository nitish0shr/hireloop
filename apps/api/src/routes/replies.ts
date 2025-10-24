import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage
interface Reply {
  id: string;
  candidateId: string;
  sequenceId?: string;
  email: string;
  subject: string;
  body: string;
  rawContent: string;
  receivedAt: string;
  createdAt: string;
}

interface ReplyClassification {
  id: string;
  replyId: string;
  classification: 'Yes' | 'Maybe' | 'No';
  confidence: number;
  reasons: string[];
  needsReview: boolean;
  classifiedAt: string;
}

let replies: Reply[] = [];
let classifications: ReplyClassification[] = [];

// Helper function to classify reply using keyword heuristics
function classifyReply(reply: Reply): ReplyClassification {
  const bodyLower = reply.body.toLowerCase();
  const subjectLower = reply.subject.toLowerCase();
  const text = `${subjectLower} ${bodyLower}`;
  
  // Positive indicators
  const yesKeywords = [
    'yes', 'interested', 'available', 'happy to', 'would love',
    'sounds good', 'looking forward', 'when can we', 'let\'s schedule',
    'i am available', 'works for me', 'count me in', 'definitely'
  ];
  
  // Negative indicators
  const noKeywords = [
    'not interested', 'no thank', 'decline', 'pass', 'remove',
    'unsubscribe', 'stop sending', 'not looking', 'not available',
    'not a fit', 'no longer interested'
  ];
  
  // Maybe indicators
  const maybeKeywords = [
    'maybe', 'possibly', 'might', 'could be', 'let me think',
    'need more info', 'tell me more', 'learn more', 'not sure',
    'question', 'curious', 'considering'
  ];
  
  // Count matches
  const yesMatches = yesKeywords.filter(kw => text.includes(kw)).length;
  const noMatches = noKeywords.filter(kw => text.includes(kw)).length;
  const maybeMatches = maybeKeywords.filter(kw => text.includes(kw)).length;
  
  let classification: 'Yes' | 'Maybe' | 'No';
  let confidence: number;
  const reasons: string[] = [];
  
  // Determine classification
  if (noMatches > yesMatches && noMatches > maybeMatches) {
    classification = 'No';
    confidence = Math.min(95, 50 + noMatches * 15);
    reasons.push('Detected negative intent keywords');
  } else if (yesMatches > noMatches && yesMatches > maybeMatches) {
    classification = 'Yes';
    confidence = Math.min(95, 50 + yesMatches * 15);
    reasons.push('Detected positive intent keywords');
  } else if (maybeMatches > 0) {
    classification = 'Maybe';
    confidence = Math.min(75, 40 + maybeMatches * 10);
    reasons.push('Detected uncertain or inquiry keywords');
  } else {
    // Default to Maybe with low confidence for ambiguous cases
    classification = 'Maybe';
    confidence = 30;
    reasons.push('No clear intent detected');
  }
  
  // Check for questions (another indicator of interest)
  const hasQuestion = text.includes('?');
  if (hasQuestion && classification !== 'No') {
    confidence = Math.min(confidence + 10, 95);
    reasons.push('Contains questions (engagement signal)');
  }
  
  // Low confidence means needs review
  const needsReview = confidence < 60;
  
  if (needsReview) {
    reasons.push('Low confidence classification - manual review recommended');
  }
  
  return {
    id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    replyId: reply.id,
    classification,
    confidence,
    reasons,
    needsReview,
    classifiedAt: new Date().toISOString()
  };
}

/**
 * @route POST /v1/replies/ingest
 * @desc Ingest a reply from a candidate
 * @access Public
 */
router.post('/ingest', (req: Request, res: Response) => {
  try {
    const { candidateId, sequenceId, email, subject, body, rawContent } = req.body;
    
    if (!candidateId || !email || !body) {
      return res.status(400).json({ error: 'Candidate ID, email, and body are required' });
    }
    
    const reply: Reply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      candidateId,
      sequenceId,
      email,
      subject: subject || '(no subject)',
      body,
      rawContent: rawContent || body,
      receivedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    replies.push(reply);
    
    // Store in audit log (placeholder - would integrate with actual audit system)
    console.log(`AUDIT: Reply ingested - ID: ${reply.id}, Candidate: ${candidateId}`);
    
    res.status(201).json({
      ...reply,
      message: 'Reply ingested successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest reply', message: (error as Error).message });
  }
});

/**
 * @route POST /v1/replies/classify
 * @desc Classify a reply (Yes/Maybe/No)
 * @access Public
 */
router.post('/classify', (req: Request, res: Response) => {
  try {
    const { replyId, reply } = req.body;
    
    if (!replyId && !reply) {
      return res.status(400).json({ error: 'Reply ID or reply data is required' });
    }
    
    let replyData: Reply | undefined;
    
    if (replyId) {
      replyData = replies.find(r => r.id === replyId);
      if (!replyData) {
        return res.status(404).json({ error: 'Reply not found' });
      }
    } else {
      replyData = reply;
    }
    
    // Check if already classified
    const existing = classifications.find(c => c.replyId === replyId);
    if (existing) {
      return res.json({
        ...existing,
        message: 'Reply was already classified (cached result)'
      });
    }
    
    // Perform classification
    const classification = classifyReply(replyData);
    classifications.push(classification);
    
    res.json(classification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to classify reply', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/replies
 * @desc Get all replies
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  const { candidateId, sequenceId, needsReview } = req.query;
  
  let filtered = replies;
  
  if (candidateId) {
    filtered = filtered.filter(r => r.candidateId === candidateId);
  }
  
  if (sequenceId) {
    filtered = filtered.filter(r => r.sequenceId === sequenceId);
  }
  
  // Filter by needs review if specified
  if (needsReview === 'true') {
    const needsReviewIds = new Set(
      classifications.filter(c => c.needsReview).map(c => c.replyId)
    );
    filtered = filtered.filter(r => needsReviewIds.has(r.id));
  }
  
  res.json({
    replies: filtered,
    total: filtered.length,
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /v1/replies/:id
 * @desc Get a specific reply with classification
 * @access Public
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const reply = replies.find(r => r.id === id);
  
  if (!reply) {
    return res.status(404).json({ error: 'Reply not found' });
  }
  
  const classification = classifications.find(c => c.replyId === id);
  
  res.json({
    reply,
    classification: classification || null
  });
});

export { router as repliesRouter };
