import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

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

// 🟢 DELETE — remove a team member by ID
export async function DELETE(req: Request) {
  try {
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
