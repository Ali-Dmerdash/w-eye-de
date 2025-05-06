import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // Adjust path if your lib folder is elsewhere

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    // Use an environment variable for the collection name, with a default
    const collectionName =
      process.env.MONGODB_MARKET_COLLECTION || "Market_LLM_Output";

    // Fetch the first document found in the collection.
    // Modify this query if you need specific filtering or multiple documents.
    const marketData = await db.collection(collectionName).findOne({});

    if (!marketData) {
      return NextResponse.json(
        { message: "No market comparison data found" },
        { status: 404 }
      );
    }

    // MongoDB returns _id as an ObjectId, which is not directly serializable to JSON
    // We need to convert it to a string.
    const serializableData = {
      ...marketData,
      _id: marketData._id.toString(),
    };

    return NextResponse.json(serializableData);
  } catch (error) {
    console.error("API Error fetching market comparison data:", error);
    // It's good practice to not expose detailed error messages to the client
    return NextResponse.json(
      { message: "Internal Server Error fetching market data" },
      { status: 500 }
    );
  }
}
