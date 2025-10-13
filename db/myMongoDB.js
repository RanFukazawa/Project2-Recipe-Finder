import { MongoClient } from "mongodb";

// Database operations
function MyMongoDB() {
  const me = {};

  const connect = async () => {
    const client = await MongoClient.connect("mongodb://localhost:47017/");
    console.log("Successfully connected to MongoDB");
    const db = client.db("recipeFinder");
    const externalRecipes = db.collection("external_recipes");
    const userRecipes = db.collection("user_recipes");

    return { client, externalRecipes, userRecipes };
  };

  // Retrieve external recipe data
  me.getRecipes = async ({ query = {}, pageSize = 20, page = 0 } = {}) => {
    const { client, externalRecipes } = await connect();

    try {
      const data = await externalRecipes
        .find(query)
        .limit(pageSize)
        .skip(pageSize * page)
        .toArray();
      console.log("Fetched external recipes from MongoDB", data);
      return data;
    } catch (err) {
      console.error("Error fetching external recipes from MongoDB", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  // Count the total number of external recipes
  me.getRecipesCount = async (query = {}) => {
    const { client, externalRecipes } = await connect();

    try {
      const count = await externalRecipes.countDocuments(query);
      return count;
    } catch (err) {
      console.error("Error counting external recipes from MongoDB", err);
      throw err;
    } finally {
      await client.close();
    }
  };

  // User recipes methods
  // me.getUserRecipes = async (userID = null) => {
  //   const { client, userRecipes } = await connect();
  //   try {
  //     const filter = userID ? { userID } : {};
  //     const cursor = userRecipes.find(filter).sort({ createdAt: -1 });
  //     return await cursor.toArray();
  //   } finally {
  //     await client.close();
  //   }
  // };

  // // create
  // me.insertUserRecipes = async (formData) => {
  //   const { client, userRecipes } = await connect();
  //   try {
  //     const document = {
  //       userID: formData.userID,
  //       name: formData.name,
  //       time: parseInt(formData.time),
  //       ingredients: formData.ingredients,
  //       steps: formData.steps,
  //       n_ingredients: formData.ingredients.length,
  //       n_steps: formData.steps.length,
  //       createdAt: new Date(),
  //     };

  //     const result = await userRecipes.insertOne(document);
  //     return result;
  //   } finally {
  //     await client.close();
  //   }

  //   // me.updateUserRecipes =
  // };
  return me;
}

const myMongoDB = MyMongoDB();
export default myMongoDB;
