// backend.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import recipeRouter from "../routes/recipeRoutes.js";
import userRecipesRouter from "../routes/userRecipeRoutes.js";
import { connectToDatabase } from "../config/db.js";

dotenv.config();
const app = express();

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "frontend")));

// API Routes
app.use("/api/user-recipes", userRecipesRouter);
app.use("/api", recipeRouter);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ status: "ok", mongodb: true });
  } catch {
    res.status(500).json({ status: "fail", mongodb: false });
  }
});

// Start server after DB connection
const PORT = process.env.PORT || 3000;
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
