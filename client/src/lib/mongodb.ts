import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    // Prevent caching on connection error
    cachedClient = null;
    cachedDb = null;
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Optional: Function to get just the DB object if needed
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

// Optional: Function to get just the collection if needed often
// Remember to replace 'Fraud_LLM_Output' if you use a different collection name elsewhere
export async function getFraudCollection() {
  const db = await getDb();
  const collectionName = process.env.MONGODB_COLLECTION || "Fraud_LLM_Output";
  return db.collection(collectionName);
}
