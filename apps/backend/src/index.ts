import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Jobs
app.post('/jobs/create', (req, res) => {
  res.json({ id: 'job_dummy' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});
