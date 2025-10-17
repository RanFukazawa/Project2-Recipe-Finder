import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "recipeFinder";

let client;
let db;

async function connect() {
  if (client && db) {
    return { client, db };
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
  };

  client = new MongoClient(uri, options);
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  db = client.db(dbName);

  return { client, db };
}

function MyMongoDB() {
  const me = {};

  me.getRecipesTotalPages = async ({ query, limit }) => {
    const { db } = await connect();
    const externalRecipes = db.collection("external_recipes");
    const totalDocs = await externalRecipes.countDocuments(query);
    return Math.ceil(totalDocs / limit);
  };

  me.getRecipes = async ({ query = {}, page = 1 }) => {
    const limit = 20;
    const { db } = await connect();
    const externalRecipes = db.collection("external_recipes");

    const totalPages = await me.getRecipesTotalPages({ query, limit });
    page = Math.min(Math.max(page, 1), totalPages);

    const data = await externalRecipes
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .toArray();

    return { data, totalPages, page };
  };

  // User favorite recipes methods
  me.getFavoriteRecipes = async (userId = null) => {
    const { db } = await connect();
    try {
      const filter = userId ? { userId } : {};
      const cursor = db
        .collection("favorite_recipes")
        .find(filter)
        .sort({ createdAt: -1 });
      return await cursor.toArray();
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
      throw error;
    }
  };

  me.addFavoriteRecipe = async (recipeData) => {
    const { db } = await connect();
    try {
      const existing = await db.collection("favorite_recipes").findOne({
        recipeId: recipeData.recipeId,
        userId: recipeData.userId,
      });

      if (existing) {
        return { alreadyExists: true, _id: existing._id };
      }

      const document = {
        userId: recipeData.userId || null,
        recipeId: recipeData.recipeId,
        name: recipeData.name,
        minutes: recipeData.minutes,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        tags: recipeData.tags || {},
        createdAt: new Date(),
      };

      const result = db.collection("favorite_recipes").insertOne(document);
      return result;
    } catch (error) {
      console.error("Error adding favorite recipe:", error);
      throw error;
    }
  };

  me.removeFavoriteRecipe = async (favoriteId) => {
    const { db } = await connect();
    try {
      const mongoID = ObjectId.createFromHexString(favoriteId);
      const result = await db.collection("favorite_recipes").deleteOne({
        _id: mongoID,
      });
      return result;
    } catch (error) {
      console.error("Error removing favorite recipe:", error);
      throw error;
    }
  };

  me.isFavorited = async (recipeId, userId = null) => {
    const { db } = await connect();
    try {
      const filter = { recipeId: recipeId };
      if (userId) filter.userId = userId;

      const favorite = await db.collection("favorite_recipes").findOne(filter);
      return !!favorite;
    } catch (error) {
      console.error("Error checking if favorited:", error);
      throw error;
    }
  };

  // User custom recipes methods
  me.getUserRecipes = async (userId = null) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");
    const filter = userId ? { userId } : {};
    return await userRecipes.find(filter).sort({ createdAt: -1 }).toArray();
  };

  me.getUserRecipeById = async (recipeId) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");
    const mongoID = ObjectId.createFromHexString(recipeId);
    return await userRecipes.findOne({ _id: mongoID });
  };

  me.insertUserRecipes = async (formData) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");

    const document = {
      userId: formData.userId,
      name: formData.name,
      minutes: parseInt(formData.minutes),
      ingredients: formData.ingredients,
      steps: formData.steps,
      n_ingredients: formData.ingredients.length,
      n_steps: formData.steps.length,
      createdAt: new Date(),
    };

    return await userRecipes.insertOne(document);
  };

  me.updateUserRecipes = async (recipeId, updateData) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");

    const allowedUpdates = {};
    for (const key of ["name", "minutes", "ingredients", "steps"]) {
      if (updateData[key] !== undefined) allowedUpdates[key] = updateData[key];
    }
    allowedUpdates.updatedAt = new Date();

    const mongoID = ObjectId.createFromHexString(recipeId);
    return await userRecipes.updateOne(
      { _id: mongoID },
      { $set: allowedUpdates },
    );
  };

  me.deleteUserRecipe = async (recipeId) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");

    const mongoID = ObjectId.createFromHexString(recipeId);
    return await userRecipes.deleteOne({ _id: mongoID });
  };

  return me;
}

const myMongoDB = MyMongoDB();
export default myMongoDB;
