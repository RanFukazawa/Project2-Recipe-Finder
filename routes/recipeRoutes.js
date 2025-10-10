import express from "express";
import myDB from "../db/myMongoDB.js";

const router = express.Router();

router.get("/recipes", async (req, res) => {
  console.log("Get /recipes route called");
  const result = await myDB.getRecipes();
  res.json({ data: result });
});

export default router;
