import express from "express";
import recipeRouter from "./routes/recipeRoutes.js";

console.log("Initializing the backend server...");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("frontend"));

app.use("/api/recipes", recipeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
