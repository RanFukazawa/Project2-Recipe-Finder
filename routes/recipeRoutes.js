import express from "express";
import myDB from "../db/myMongoDB.js";

const router = express.Router();

router.get("/recipes", async (req, res) => {
  console.log("Received request for /api/recipes");
  try {
    const page = req.query.page ? +req.query.page : 1;
    const result = await myDB.getRecipes({ query: {}, page });

    res.json(result);
  } catch (error) {
    console.error("Error fetching external recipes:", error);
    res.status(500).json({ error: "Internal Server Error", recipes: [] });
  }
});

export default router;
