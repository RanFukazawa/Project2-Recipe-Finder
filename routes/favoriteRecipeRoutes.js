import express from "express";
import myMongoDB from "../db/myMongoDB.js";

const router = express.Router();

// GET /api/recipes (with optional pagination)
router.get("/", async (req, res) => {
  try {
    console.log("📥 GET /api/favorite-recipes called");
    const recipes = await myMongoDB.getFavoriteRecipes();
    res.json(recipes);
  } catch (error) {
    console.error("❌ Error fetching favorite recipes:", error);
    res.status(500).json({ message: "Failed to fetch favorite recipes" });
  }
});

// POST favorite recipes
router.post("/", async (req, res) => {
  try {
    console.log("📥 POST /api/favorite-recipes called");
    console.log("Request body:", req.body);

    const { recipeId, name, minutes, ingredients, steps, tags, nutrition } =
      req.body;

    if (!recipeId || !name || !minutes || !ingredients || !steps) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const recipeData = {
      recipeId: recipeId,
      name: name,
      minutes: minutes,
      ingredients: ingredients,
      steps: steps,
      tags: tags || [],
      nutrition: nutrition || [],
      userId: req.user?.id || null,
    };

    const result = await myMongoDB.addFavoriteRecipe(recipeData);

    if (result.alreadyExists) {
      return res.status(200).json({
        message: "Recipe already in favorites",
        alreadyExists: true,
      });
    }

    res.status(201).json({
      message: "Added to favorites successfully",
      favoriteId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Failed to add to favorites" });
  }
});

// DELETE remove from favorites
router.delete("/:id", async (req, res) => {
  try {
    console.log("📥 DELETE /api/favorite-recipes/:id called");
    const result = await myMongoDB.removeFavoriteRecipe(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

export default router;
