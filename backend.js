import express from "express";
import recipeRouter from "./routes/recipeRoutes.js";
import userRecipesRouter from "./routes/userRecipeRoutes.js";

console.log("Initializing the backend server...");
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static("frontend"));

// API Routes
app.use("/api/user-recipes", userRecipesRouter);
app.use("/api", recipeRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb: !!process.env.MONGODB_URI,
    env: process.env.NODE_ENV,
  });
});

// Catch-all route - serve index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "frontend" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
