import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fs from "fs";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/note.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/users", authRoutes);
app.use("/api/notes", noteRoutes);

// Localhost check
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running");
});


// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "✅ Local API is running successfully" });
});

const __dirname = path.resolve();
const frontendDistPath = path.join(__dirname, "frontend", "dist");
const indexFile = path.join(frontendDistPath, "index.html");

// ✅ Serve frontend ONLY if build actually exists
if (process.env.NODE_ENV === "production" && fs.existsSync(indexFile)) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(indexFile);
  });
}

// Connect DB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🟢 API Health Check → http://localhost:${PORT}/api/health`);
  console.log(`🧠 NODE_ENV = ${process.env.NODE_ENV || "not set"}`);
});
