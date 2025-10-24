import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health';
import { jobsRouter } from './routes/jobs';
import { applicationsRouter } from './routes/applications';
import { screeningRouter } from './routes/screening';
import { sequencesRouter } from './routes/sequences';
import { repliesRouter } from './routes/replies';
import { scheduleRouter } from './routes/schedule';
import { metricsRouter } from './routes/metrics';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/', healthRouter);
app.use('/v1/jobs', jobsRouter);
app.use('/v1/applications', applicationsRouter);
app.use('/v1', screeningRouter);
app.use('/v1/sequences', sequencesRouter);
app.use('/v1/replies', repliesRouter);
app.use('/v1', scheduleRouter);
app.use('/v1/metrics', metricsRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});

export default app;
