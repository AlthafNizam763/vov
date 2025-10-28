import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); // use your DB name
    const hero = await db.collection("heroes").findOne({});
    return NextResponse.json(hero || {});
  } catch (err) {
    console.error("❌ GET /hero failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Upsert (create or update)
    const result = await db.collection("heroes").updateOne(
      {},
      { $set: data },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("❌ PUT /hero failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
