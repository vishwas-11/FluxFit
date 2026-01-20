import app from './app';
import { connectDB } from './config/db';  
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down backend...");
  server.close(() => {
    console.log("✅ Backend shut down gracefully");
    process.exit(0);
  });
});

