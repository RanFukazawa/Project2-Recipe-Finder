import express from "express";
import myMongoDB from "../db/myMongoDB.js";

const router = express.Router();

// GET /api/recipes (with optional pagination)
router.get("/", async (req, res) => {
  try {
    console.log("📥 GET /api/recipes called");
    console.log("Query params:", req.query);

    const page = parseInt(req.query.page) || 1;
    const query = {};

    const recipes = await myMongoDB.getRecipes({ query, page });

    console.log("✅ Recipes fetched:", recipes.data?.length || 0, "recipes");
    res.json(recipes);
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    res.status(500).json({
      message: "Failed to fetch recipes",
      error: error.message,
    });
  }
});

// GET /api/recipes/:id
router.get("/:id", async (req, res) => {
  try {
    console.log("📥 GET /api/recipes/:id called with id:", req.params.id);
    const recipe = await myMongoDB.getRecipeById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("❌ Error fetching recipe:", error);
    res.status(500).json({
      message: "Failed to fetch recipe",
      error: error.message,
    });
  }
});

export default router;
