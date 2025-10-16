// routes/userRecipeRoutes.js
import express from "express";
import myMongoDB from "../db/myMongoDB.js";

const router = express.Router();

// GET all user recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await myMongoDB.getUserRecipes();
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

// GET single user recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await myMongoDB.getUserRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});

// POST create (upload) user custom recipe
router.post("/", async (req, res) => {
  try {
    const { name, minutes, ingredients, steps } = req.body;

    if (!name || !minutes || !ingredients || !steps) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
      return res
        .status(400)
        .json({ message: "Ingredients and steps must be arrays" });
    }

    if (ingredients.length === 0 || steps.length === 0) {
      return res
        .status(400)
        .json({ message: "Ingredients and steps cannot be empty" });
    }

    const recipeData = {
      name: name.trim(),
      minutes: parseInt(minutes),
      ingredients: ingredients.map((i) => i.trim()).filter(Boolean),
      steps: steps.map((s) => s.trim()).filter(Boolean),
      isPublic: false,
    };

    const result = await myMongoDB.insertUserRecipes(recipeData);

    res.status(201).json({
      message: "Recipe uploaded successfully",
      recipeId: result.insertedId,
    });
  } catch (error) {
    console.error("Error uploading recipe:", error);
    res.status(500).json({ message: "Failed to upload recipe" });
  }
});

// PUT update user recipe
router.put("/:id", async (req, res) => {
  try {
    const { name, minutes, ingredients, steps } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (minutes) updateData.minutes = parseInt(minutes);
    if (ingredients)
      updateData.ingredients = ingredients.map((i) => i.trim()).filter(Boolean);
    if (steps) updateData.steps = steps.map((s) => s.trim()).filter(Boolean);

    const result = await myMongoDB.updateUserRecipes(req.params.id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
});

// DELETE user recipe
router.delete("/:id", async (req, res) => {
  try {
    const result = await myMongoDB.deleteUserRecipe(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

export default router;
