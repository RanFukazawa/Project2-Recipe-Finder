// backend.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import recipeRouter from "./routes/recipeRoutes.js";
import userRecipesRouter from "./routes/userRecipeRoutes.js";
import { connectToDatabase } from "./config/db.js";

dotenv.config();
const app = express();

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes - MUST come before static files
app.use("/api/user-recipes", userRecipesRouter);
app.use("/api/recipes", recipeRouter);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      status: "ok",
      mongodb: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "fail",
      mongodb: false,
      error: error.message,
    });
  }
});

// Serve static files - this automatically serves index.html at /
app.use(express.static(path.join(__dirname, "frontend")));

// REMOVED: The problematic catch-all route
// express.static() already handles serving files, including index.html

// Start server after DB connection
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to connect to database:", error);
      process.exit(1);
    });
}

// Export for Vercel
export default app;
