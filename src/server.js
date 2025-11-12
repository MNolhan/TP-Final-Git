import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import requestTypesRouter from "./routes/requestTypes.js"; // 👈 ajoute ça

dotenv.config();

const app = express();
app.use(express.json());

// Health
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// 👇 monte les routes CRUD
app.use("/api/request-types", requestTypesRouter);

// 404
app.use((req, res, _next) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// 500
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start
connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
  );
});

export { app };
