import { MongoClient, ObjectId } from "mongodb";

// Database operations
function MyMongoDB() {
  const me = {};
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:47017/";

  const connect = async () => {
    const client = await MongoClient.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB");
    const db = client.db("recipeFinder");
    const externalRecipes = db.collection("external_recipes");
    const userRecipes = db.collection("user_recipes");

    return { client, externalRecipes, userRecipes };
  };

  me.getRecipesTotalPages = async ({ query, limit }) => {
    const { client, externalRecipes } = await connect();
    console.log("Connected to MongoDB for total pages calculation");
    try {
      const totalPages = Math.ceil(
        (await externalRecipes.countDocuments(query)) / limit,
      );
      console.log("Total pages:", totalPages);
      return totalPages;
    } finally {
      await client.close();
    }
  };

  // Retrieve external recipe data
  me.getRecipes = async ({ query = {}, page = 1 }) => {
    const projection = {};
    const limit = 20;

    const { client, externalRecipes } = await connect();
    try {
      const totalPages = await me.getRecipesTotalPages({ query, limit });

      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      const data = await externalRecipes
        .find(query, {
          projection,
          limit,
          skip: (page - 1) * limit,
        })
        .toArray();
      console.log("Fetched external recipes from MongoDB", data);
      return { data, totalPages, page };
    } catch (err) {
      console.error("Error fetching external recipes from MongoDB", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  // Retrieve user custom recipes
  me.getUserRecipes = async (userId = null) => {
    const { client, userRecipes } = await connect();
    try {
      const filter = userId ? { userId } : {};
      const cursor = userRecipes.find(filter).sort({ createdAt: -1 });
      return await cursor.toArray();
    } finally {
      await client.close();
    }
  };

  me.getUserRecipeById = async (recipeId) => {
    const { client, userRecipes } = await connect();
    try {
      const mongoID = ObjectId.createFromHexString(recipeId);
      return await userRecipes.findOne({ _id: mongoID });
    } finally {
      await client.close();
    }
  };

  // Create user custom recipes
  me.insertUserRecipes = async (formData) => {
    const { client, userRecipes } = await connect();
    try {
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

      const result = await userRecipes.insertOne(document);
      return result;
    } finally {
      await client.close();
    }
  };

  // Update user custom recipes
  me.updateUserRecipes = async (recipeId, updateData) => {
    const { client, userRecipes } = await connect();

    try {
      const allowedUpdates = {};

      if (updateData.name !== undefined) {
        allowedUpdates.name = updateData.name;
      }
      if (updateData.minutes !== undefined) {
        allowedUpdates.minutes = updateData.minutes;
      }
      if (updateData.ingredients !== undefined) {
        allowedUpdates.ingredients = updateData.ingredients;
      }
      if (updateData.steps !== undefined) {
        allowedUpdates.steps = updateData.steps;
      }

      allowedUpdates.updatedAt = new Date();

      const result = await userRecipes.updateOne(
        { _id: recipeId },
        { $set: allowedUpdates },
      );
      return result;
    } finally {
      await client.close();
    }
  };

  me.deleteUserRecipe = async (recipeId) => {
    const { client, userRecipes } = await connect();
    try {
      const result = await userRecipes.deleteOne({
        _id: recipeId,
      });
      return result;
    } finally {
      await client.close();
    }
  };

  return me;
}

const myMongoDB = MyMongoDB();
export default myMongoDB;
