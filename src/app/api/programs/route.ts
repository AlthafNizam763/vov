import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

// 🟢 GET: fetch all programs
interface Program {
  passage?: string;
  date?: string;
  image?: string;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const programs = await db.collection("programs").find({}).toArray();

    return NextResponse.json(programs);
  } catch (err) {
    console.error("❌ GET /programs failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟢 POST: add a new program (with optional image upload)
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let newProgram: Program = {};
    let imageBase64 = "";

    // 🧩 Handle FormData (multipart)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      newProgram.passage = formData.get("passage") as string;
      newProgram.date = formData.get("date") as string;

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        imageBase64 = `data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`;
        newProgram.image = imageBase64;
      }
    } 
    // 🧩 Handle JSON (no image)
    else {
      const data = await req.json();
      newProgram = data as Program;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("programs").insertOne({
      ...newProgram,
      createdAt: new Date(),
    });

    return NextResponse.json({ _id: result.insertedId, ...newProgram });
  } catch (err) {
    console.error("❌ POST /programs failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟢 DELETE: remove a program by id
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection("programs")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: result.deletedCount === 1 });
  } catch (err) {
    console.error("❌ DELETE /programs failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
