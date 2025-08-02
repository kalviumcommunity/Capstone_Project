import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleSignup,
  handleLogin,
  handleGetProfile,
  handleTrackMood,
  handleSaveConversation,
} from "./routes/auth";
import { authMiddleware } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);

  // Protected routes (require authentication)
  app.get("/api/auth/profile", authMiddleware, handleGetProfile);
  app.post("/api/auth/mood", authMiddleware, handleTrackMood);
  app.post("/api/auth/conversation", authMiddleware, handleSaveConversation);

  return app;
}
require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));
