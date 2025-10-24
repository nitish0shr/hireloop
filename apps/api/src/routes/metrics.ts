import { Router, Request, Response } from 'express';

const router = Router();

// Mock data for metrics (would be replaced with actual database queries)
interface FunnelMetrics {
  jobs: {
    total: number;
    active: number;
    draft: number;
  };
  candidates: {
    total: number;
    byLabel: {
      strong: number;
      consider: number;
      not: number;
    };
    byStatus: {
      new: number;
      screening: number;
      interview: number;
      offer: number;
      rejected: number;
    };
  };
  applications: {
    total: number;
    last7Days: number;
    last30Days: number;
  };
  sequences: {
    total: number;
    active: number;
    sendCount: number;
    deliveryRate: number;
  };
  replies: {
    total: number;
    classified: {
      yes: number;
      maybe: number;
      no: number;
    };
    needsReview: number;
  };
  scheduling: {
    proposalsCreated: number;
    eventsScheduled: number;
  };
  timeToFirstInterview: {
    averageDays: number;
    medianDays: number;
    samples: number;
  };
  timestamp: string;
}

/**
 * @route GET /v1/metrics/funnel
 * @desc Get funnel metrics for dashboard
 * @access Public
 */
router.get('/funnel', (req: Request, res: Response) => {
  try {
    // Mock data - in production, these would be database queries
    const metrics: FunnelMetrics = {
      jobs: {
        total: 12,
        active: 8,
        draft: 4
      },
      candidates: {
        total: 145,
        byLabel: {
          strong: 23,
          consider: 67,
          not: 55
        },
        byStatus: {
          new: 42,
          screening: 58,
          interview: 25,
          offer: 8,
          rejected: 12
        }
      },
      applications: {
        total: 145,
        last7Days: 18,
        last30Days: 78
      },
      sequences: {
        total: 5,
        active: 3,
        sendCount: 234,
        deliveryRate: 97.5
      },
      replies: {
        total: 52,
        classified: {
          yes: 18,
          maybe: 24,
          no: 10
        },
        needsReview: 8
      },
      scheduling: {
        proposalsCreated: 25,
        eventsScheduled: 18
      },
      timeToFirstInterview: {
        averageDays: 7.3,
        medianDays: 6,
        samples: 25
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve metrics', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/metrics/jobs/:jobId
 * @desc Get metrics for a specific job
 * @access Public
 */
router.get('/jobs/:jobId', (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    // Mock job-specific metrics
    const jobMetrics = {
      jobId,
      applications: {
        total: 34,
        last7Days: 8,
        byLabel: {
          strong: 6,
          consider: 18,
          not: 10
        }
      },
      funnel: {
        applied: 34,
        screened: 28,
        interviewed: 8,
        offered: 2,
        hired: 0
      },
      averageTimeInStage: {
        screening: 2.1,
        interview: 5.5,
        offer: 3.2
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(jobMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job metrics', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/metrics/sequences/:sequenceId
 * @desc Get metrics for a specific outreach sequence
 * @access Public
 */
router.get('/sequences/:sequenceId', (req: Request, res: Response) => {
  try {
    const { sequenceId } = req.params;
    
    // Mock sequence-specific metrics
    const sequenceMetrics = {
      sequenceId,
      sends: {
        total: 87,
        queued: 12,
        sent: 72,
        bounced: 2,
        unsubscribed: 1
      },
      engagement: {
        replies: 18,
        replyRate: 20.7,
        positiveReplies: 7,
        positiveRate: 8.0
      },
      timing: {
        averageTimeToFirstReply: 1.8,
        averageTimeToPositiveReply: 2.3
      },
      byStep: [
        { stepIndex: 0, sent: 87, replies: 8, positiveReplies: 3 },
        { stepIndex: 1, sent: 79, replies: 6, positiveReplies: 2 },
        { stepIndex: 2, sent: 73, replies: 4, positiveReplies: 2 }
      ],
      timestamp: new Date().toISOString()
    };
    
    res.json(sequenceMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sequence metrics', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/metrics/dashboard
 * @desc Get comprehensive dashboard metrics
 * @access Public
 */
router.get('/dashboard', (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Mock comprehensive dashboard metrics
    const dashboardMetrics = {
      overview: {
        activeJobs: 8,
        totalCandidates: 145,
        interviewsScheduled: 18,
        offersExtended: 8
      },
      trends: {
        applicationsThisWeek: 18,
        applicationsLastWeek: 22,
        interviewsThisWeek: 5,
        interviewsLastWeek: 6
      },
      topJobs: [
        { jobId: 'job_1', title: 'Senior Software Engineer', applications: 34, interviews: 8 },
        { jobId: 'job_2', title: 'Product Manager', applications: 28, interviews: 6 },
        { jobId: 'job_3', title: 'Data Scientist', applications: 25, interviews: 5 }
      ],
      recentActivity: {
        newApplications: 18,
        repliesReceived: 7,
        interviewsScheduled: 3,
        lastUpdated: new Date().toISOString()
      },
      dateRange: {
        start: startDate || new Date(Date.now() - 30 * 86400000).toISOString(),
        end: endDate || new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(dashboardMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve dashboard metrics', message: (error as Error).message });
  }
});

export { router as metricsRouter };
