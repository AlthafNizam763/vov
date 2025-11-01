import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export const runtime = "nodejs";

export async function GET() {
  // Try DB first if configured, otherwise fall back to static JSON
  try {
    if (process.env.MONGODB_URI) {
      const { default: clientPromise } = await import("../../../lib/mongodb");
      const client = await clientPromise;
      const db = process.env.MONGODB_DB ? client.db(process.env.MONGODB_DB) : client.db();
      const hero = await db.collection("heroes").findOne({});
      if (hero) return NextResponse.json(hero);
    }
  } catch (err) {
    console.error("❌ GET /hero DB fetch failed, falling back to file:", err);
  }

  try {
    const filePath = path.join(process.cwd(), "data", "hero.json");
    const data = await readFile(filePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (fileErr) {
    console.error("❌ GET /hero fallback file read failed:", fileErr);
    return NextResponse.json({ error: "Failed to load hero data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  // Require DB for writes
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Database not configured. Set MONGODB_URI to enable updates." },
      { status: 503 }
    );
  }

  try {
    const data = await req.json();
    const { default: clientPromise } = await import("../../../lib/mongodb");
    const client = await clientPromise;
    const db = process.env.MONGODB_DB ? client.db(process.env.MONGODB_DB) : client.db();

    const result = await db
      .collection("heroes")
      .updateOne({}, { $set: data }, { upsert: true });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("❌ PUT /hero failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
