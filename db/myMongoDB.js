import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DBNAME || "recipeFinder";

let client;
let db;

async function connect() {
  // Reuse connection if already connected
  if (client && db) {
    return { client, db };
  }

  client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);

  console.log("✅ Connected to MongoDB:", dbName);
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

  me.getUserRecipes = async (userId = null) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");
    const filter = userId ? { userId } : {};
    return await userRecipes.find(filter).sort({ createdAt: -1 }).toArray();
  };

  me.getUserRecipeById = async (recipeId) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");
    const mongoID = new ObjectId(recipeId);
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

    const mongoID = new ObjectId(recipeId);
    return await userRecipes.updateOne(
      { _id: mongoID },
      { $set: allowedUpdates },
    );
  };

  me.deleteUserRecipe = async (recipeId) => {
    const { db } = await connect();
    const userRecipes = db.collection("user_recipes");

    const mongoID = new ObjectId(recipeId);
    return await userRecipes.deleteOne({ _id: mongoID });
  };

  return me;
}

const myMongoDB = MyMongoDB();
export default myMongoDB;
