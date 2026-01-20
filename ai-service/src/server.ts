import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn("⚠️ MONGO_URI is not set in ai-service .env. DB-dependent features will fail.");
}

mongoose
  .connect(MONGO_URI || "mongodb://localhost:27017")
  .then(() => {
    console.log("✅ AI DB connected");
  })
  .catch((err) => {
    console.error("❌ AI DB connection failed:", err.message);
    console.error("   Set MONGO_URI in ai-service/.env to your MongoDB URL. Service will stay up; /recommend will fail until DB is connected.");
  });

const PORT = process.env.PORT || 6000;

const server = app.listen(PORT, () => {
  console.log(`🤖 AI Service running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down AI service...");
  server.close(() => {
    console.log("✅ AI service shut down gracefully");
    process.exit(0);
  });
});
