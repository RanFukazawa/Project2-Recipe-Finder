// backend.js
import express from "express";

import recipeRouter from "./routes/recipeRoutes.js";
import userRecipesRouter from "./routes/userRecipeRoutes.js";
import myMongoDB from "./db/myMongoDB.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/user-recipes", userRecipesRouter);
app.use("/api/recipes", recipeRouter);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await myMongoDB.getRecipesTotalPages({ query: {}, limit: 1 });
    res.json({
      status: "ok",
      mongodb: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      mongodb: false,
      error: error.message,
    });
  }
});

// Serve static files
app.use(express.static("frontend"));

// For local development only
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;
