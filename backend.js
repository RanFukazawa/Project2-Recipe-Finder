import express from "express";
import recipeRouter from "./routes/recipeRoutes.js";
import userRecipesRouter from "./routes/userRecipeRoutes.js";

console.log("Initializing the backend server...");
const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static("frontend"));

// Routes
app.use("/api", recipeRouter);
app.use("/api/user-recipes", userRecipesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
