// File: src/app/api/revenue-data/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // Adjust path if your lib folder is elsewhere

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    // --- Make sure this is your correct collection name for revenue data ---
    const collectionName = "Revenue_LLM_Output";

    // Fetch the first document found in the revenue collection.
    // Modify this query if you need specific filtering or multiple documents.
    const revenueData = await db.collection(collectionName).findOne({});

    if (!revenueData) {
      return NextResponse.json(
        { message: "No revenue data found" },
        { status: 404 }
      );
    }

    // Convert MongoDB _id to string for JSON serialization
    const serializableData = {
      ...revenueData,
      _id: revenueData._id.toString(),
    };

    return NextResponse.json(serializableData);
  } catch (error) {
    console.error("API Error fetching revenue data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
