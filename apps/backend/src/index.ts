import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Jobs: create
app.post('/jobs/create', async (req, res) => {
  const { jdText, fileUrl } = req.body;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert({ jd_text: jdText, file_url: fileUrl })
      .select()
      .single();
    if (error) throw error;
    res.json({
      id: data.id,
      publicUrl: `https://example.com/job/${data.id}`,
      externalId: `ext_${data.id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Jobs: publish
app.post('/jobs/publish', async (req, res) => {
  const { jobId } = req.body;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({ published: true })
      .eq('id', jobId)
      .select()
      .single();
    if (error) throw error;
    res.json({
      jobId: data.id,
      publicUrl: `https://example.com/job/${data.id}`,
      externalId: `ext_${data.id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Candidates: ingest
app.post('/candidates/ingest', (req, res) => {
  const { jobId, fileUrl, emailParse, profile } = req.body;
  res.json({ id: 'cand_dummy', jobId, status: 'ingested' });
});

// Candidates: score
app.post('/candidates/score', (req, res) => {
  const { candId } = req.body;
  res.json({
    candId,
    fitScore: 80,
    coverage: 0.85,
    flags: [],
    notes: 'stub notes',
  });
});

// Pipeline: move
app.post('/pipeline/move', (req, res) => {
  const { candId, toStage } = req.body;
  res.json({
    candId,
    toStage,
    activityId: `activity_${candId}_${toStage}`,
  });
});

// Outreach: send
app.post('/outreach/send', (req, res) => {
  const { candId, step } = req.body;
  res.json({ messageId: `message_${candId}_${step}` });
});

// Schedule: propose
app.post('/schedule/propose', (req, res) => {
  const { candId, recruiterId } = req.body;
  const now = Date.now();
  const slots = Array.from({ length: 3 }).map((_, i) => {
    const start = new Date(now + (i + 1) * 3600 * 1000);
    const end = new Date(start.getTime() + 30 * 60000);
    return {
      id: `slot_${i + 1}`,
      start: start.toISOString(),
      end: end.toISOString(),
    };
  });
  res.json({ slots });
});

// Schedule: confirm
app.post('/schedule/confirm', (req, res) => {
  const { candId, slotId } = req.body;
  res.json({
    eventId: `event_${candId}_${slotId}`,
    meetingLink: `https://example.com/meet/${candId}/${slotId}`,
  });
});

// Reports: roleHealth
app.post('/reports/roleHealth', (req, res) => {
  const { jobId } = req.body;
  res.json({
    qualifiedOnHand: 3,
    replyRate: 0.5,
    interviews7d: 1,
    newApps24h: 2,
    healthIndex: 0.8,
  });
});

// Prep: pack
app.post('/prep/pack', (req, res) => {
  const { candId } = req.body;
  res.json({ pdfUrl: `https://example.com/prep/${candId}.pdf` });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});
