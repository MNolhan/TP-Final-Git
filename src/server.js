import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import requestTypesRouter from './routes/requestTypes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/request-types', requestTypesRouter);

app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`),
  );
});

export { app };
