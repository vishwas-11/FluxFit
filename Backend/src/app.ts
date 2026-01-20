import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import logRoutes from './routes/log.routes';
import { errorHandler } from './middlewares/error.middleware';
import aiRoutes from './routes/ai.routes';
import youtubeRoutes from "./routes/youtube.routes";
import { loggerMiddleware } from './middlewares/logger.middleware';

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
];

// In production, allow requests from same origin (nginx proxy) or no origin
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman, curl, or same-origin requests)
      if (!origin) return callback(null, true);

      // In production, allow all origins since requests come through nginx proxy
      // In development, only allow specific origins
      if (isProduction || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Allow up to 5MB for profile updates with base64 images (2MB file → ~2.7MB base64)
app.use(express.json({ limit: "5mb" }));
app.use(loggerMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/youtube", youtubeRoutes);


app.use(errorHandler);

export default app;




