import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage
interface ScheduleProposal {
  id: string;
  candidateId: string;
  interviewerEmail?: string;
  proposedSlots: Array<{
    start: string;
    end: string;
  }>;
  timezone: string;
  createdAt: string;
}

interface CalendarEvent {
  id: string;
  proposalId: string;
  candidateId: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  attendees: string[];
  provider: 'google' | 'ics';
  providerEventId?: string;
  icsContent?: string;
  createdAt: string;
}

let scheduleProposals: ScheduleProposal[] = [];
let calendarEvents: CalendarEvent[] = [];

// Helper function to generate ICS content
function generateICS(event: CalendarEvent): string {
  const dtStart = new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtEnd = new Date(event.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const attendeesStr = event.attendees
    .map(email => `ATTENDEE:mailto:${email}`)
    .join('\r\n');
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HireLoop//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@hireloop.com`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    attendeesStr,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(line => line).join('\r\n');
}

// Helper function to create calendar event (mock Google Calendar integration)
async function createGoogleCalendarEvent(event: CalendarEvent): Promise<{ success: boolean; eventId?: string; error?: string }> {
  // Placeholder for Google Calendar API integration
  // In production, this would use the Google Calendar API with OAuth credentials
  
  // Check if Google credentials are configured
  const hasGoogleCreds = process.env.GOOGLE_CALENDAR_CLIENT_ID && process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  
  if (!hasGoogleCreds) {
    return { success: false, error: 'Google Calendar credentials not configured' };
  }
  
  // Mock successful creation
  const mockEventId = `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // In production, this would make actual API calls:
  // const auth = await getGoogleAuth();
  // const calendar = google.calendar({ version: 'v3', auth });
  // const response = await calendar.events.insert({ ... });
  
  return { success: true, eventId: mockEventId };
}

/**
 * @route POST /v1/schedule
 * @desc Create scheduling proposal and optionally create calendar event
 * @access Public
 */
router.post('/schedule', async (req: Request, res: Response) => {
  try {
    const { 
      candidateId, 
      candidateEmail,
      interviewerEmail, 
      proposedSlots, 
      timezone,
      createEvent,
      selectedSlot,
      eventDetails 
    } = req.body;
    
    if (!candidateId || !candidateEmail) {
      return res.status(400).json({ error: 'Candidate ID and email are required' });
    }
    
    // If no proposed slots provided, generate default slots
    const slots = proposedSlots || [
      {
        start: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow 9 AM
        end: new Date(Date.now() + 86400000 * 1 + 3600000).toISOString() // Tomorrow 10 AM
      },
      {
        start: new Date(Date.now() + 86400000 * 2).toISOString(), // Day after tomorrow 9 AM
        end: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString()
      },
      {
        start: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now 9 AM
        end: new Date(Date.now() + 86400000 * 3 + 3600000).toISOString()
      }
    ];
    
    const proposal: ScheduleProposal = {
      id: `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      candidateId,
      interviewerEmail,
      proposedSlots: slots,
      timezone: timezone || 'UTC',
      createdAt: new Date().toISOString()
    };
    
    scheduleProposals.push(proposal);
    
    let calendarEvent: CalendarEvent | null = null;
    let googleResult: any = null;
    
    // If createEvent is true and selectedSlot is provided, create calendar event
    if (createEvent && selectedSlot) {
      const slot = slots[selectedSlot] || slots[0];
      
      const event: CalendarEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        proposalId: proposal.id,
        candidateId,
        title: eventDetails?.title || `Interview with ${candidateId}`,
        description: eventDetails?.description || 'Interview scheduled via HireLoop',
        start: slot.start,
        end: slot.end,
        location: eventDetails?.location || 'Video Call',
        attendees: [candidateEmail, interviewerEmail].filter(Boolean),
        provider: 'ics', // Default to ICS
        createdAt: new Date().toISOString()
      };
      
      // Try Google Calendar first if credentials available
      try {
        googleResult = await createGoogleCalendarEvent(event);
        
        if (googleResult.success) {
          event.provider = 'google';
          event.providerEventId = googleResult.eventId;
        }
      } catch (error) {
        console.log('Google Calendar creation failed, falling back to ICS:', (error as Error).message);
      }
      
      // Generate ICS as fallback or primary method
      event.icsContent = generateICS(event);
      
      calendarEvents.push(event);
      calendarEvent = event;
    }
    
    res.json({
      proposal,
      calendarEvent,
      message: calendarEvent 
        ? `Event created via ${calendarEvent.provider.toUpperCase()}`
        : 'Schedule proposal created. Use selectedSlot and createEvent=true to create calendar event.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule', message: (error as Error).message });
  }
});

/**
 * @route GET /v1/schedule/:proposalId
 * @desc Get schedule proposal and associated events
 * @access Public
 */
router.get('/schedule/:proposalId', (req: Request, res: Response) => {
  const { proposalId } = req.params;
  const proposal = scheduleProposals.find(p => p.id === proposalId);
  
  if (!proposal) {
    return res.status(404).json({ error: 'Schedule proposal not found' });
  }
  
  const events = calendarEvents.filter(e => e.proposalId === proposalId);
  
  res.json({
    proposal,
    events,
    total: events.length
  });
});

/**
 * @route GET /v1/schedule/events/:eventId/ics
 * @desc Download ICS file for an event
 * @access Public
 */
router.get('/schedule/events/:eventId/ics', (req: Request, res: Response) => {
  const { eventId } = req.params;
  const event = calendarEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (!event.icsContent) {
    event.icsContent = generateICS(event);
  }
  
  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', `attachment; filename="interview-${event.id}.ics"`);
  res.send(event.icsContent);
});

export { router as scheduleRouter };
