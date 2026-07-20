import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { requireContentEditor } from "../../../lib/session-server";

export const runtime = "nodejs"; // Ensures this runs on the server

// 🟢 GET — fetch all team members
interface TeamMember {
  name?: string;
  bio?: string;
  image?: string;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const team = await db.collection("team").find({}).toArray();

    return NextResponse.json(team);
  } catch (err) {
    console.error("❌ GET /team failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟢 POST — add a new team member (supports image upload)
export async function POST(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

    const contentType = req.headers.get("content-type") || "";
    let newMember: TeamMember = {};
    let imageBase64 = "";

    // Handle multipart/form-data (for image upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      newMember.name = formData.get("name") as string;
      newMember.bio = formData.get("bio") as string;

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        imageBase64 = `data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`;
        newMember.image = imageBase64;
      }
    } 
    // Handle JSON (no image upload)
    else {
      const data = await req.json();
      newMember = data as TeamMember;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("team").insertOne({
      ...newMember,
      createdAt: new Date(),
    });

    return NextResponse.json({ _id: result.insertedId, ...newMember });
  } catch (err) {
    console.error("❌ POST /team failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟢 PUT — update a team member (image optional — kept if none uploaded)
export async function PUT(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

    const contentType = req.headers.get("content-type") || "";

    let id = "";
    const updates: TeamMember = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = (formData.get("id") as string) || "";

      updates.name = (formData.get("name") as string) ?? "";
      updates.bio = (formData.get("bio") as string) ?? "";

      // Only replace the image when a new file was actually chosen.
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        updates.image = `data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`;
      }
    } else {
      const { id: bodyId, ...rest } = await req.json();
      id = bodyId;
      Object.assign(updates, rest as TeamMember);
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid team member id" }, { status: 400 });
    }

    if (!updates.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection("team")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const updated = await db.collection("team").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ PUT /team failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟢 DELETE — remove a team member by ID
export async function DELETE(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("team").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: result.deletedCount === 1 });
  } catch (err) {
    console.error("❌ DELETE /team failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
