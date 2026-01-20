import express from 'express';
import cors from 'cors'
import recommendRoutes from './routes/recommend.routes'
import { errorHandler } from './middlewares/error.middleware'
import { aiRateLimiter } from './middlewares/rateLimit.middleware';
import youtubeRoutes from './routes/youtube.routes'

const app = express();
app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ai-service",
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/internal/recommend', aiRateLimiter, recommendRoutes)
app.use('/api/youtube', youtubeRoutes)
app.use(errorHandler)

export default app;

