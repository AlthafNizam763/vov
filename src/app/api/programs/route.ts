import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { requireContentEditor } from "../../../lib/session-server";

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
    const denied = await requireContentEditor();
    if (denied) return denied;

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

// 🟢 PUT: update an existing program (image optional — kept if none uploaded)
export async function PUT(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

    const contentType = req.headers.get("content-type") || "";

    let id = "";
    const updates: Program = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = (formData.get("id") as string) || "";

      updates.passage = (formData.get("passage") as string) ?? "";
      updates.date = (formData.get("date") as string) ?? "";

      // Only replace the image when a new file was actually chosen.
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        updates.image = `data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`;
      }
    } else {
      const { id: bodyId, ...rest } = await req.json();
      id = bodyId;
      Object.assign(updates, rest as Program);
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid program id" }, { status: 400 });
    }

    if (!updates.passage?.trim()) {
      return NextResponse.json({ error: "Program details are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection("programs")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const updated = await db.collection("programs").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ PUT /programs failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟢 DELETE: remove a program by id
export async function DELETE(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

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
