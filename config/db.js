// db.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("recipeFinder"); // name your database
    console.log("✅ Connected to MongoDB Atlas");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error(
      "❗ Database not initialized. Call connectToDatabase() first.",
    );
  }
  return db;
}
