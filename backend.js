import express from "express";
import recipeRouter from "./routes/recipeRoutes.js";
import userRecipesRouter from "./routes/userRecipeRoutes.js";

console.log("Initializing the backend server...");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("frontend"));
app.use("/api", recipeRouter);

app.use("/api/user_recipes", userRecipesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
