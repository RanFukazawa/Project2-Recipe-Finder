import express from "express";
import myDB from "../db/myMongoDB.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Received request for /api/recipes");

  try {
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const query = {};

    const recipes = await myDB.getRecipes({ query, page, pageSize });
    const total = await myDB.getRecipesCount(query);

    res.json({ recipes, total });
  } catch (error) {
    console.error("Error fetching external recipes:", error);
    res.status(500).json({ error: "Internal Server Error", recipes: [] });
  }
});

export default router;
