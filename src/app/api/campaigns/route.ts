import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { requireContentEditor } from "../../../lib/session-server";

export const runtime = "nodejs";

interface Campaign {
  title?: string;
  passage?: string;
  amount?: string;
  detail?: string;
  image?: string;
}

// 🔹 GET all campaigns
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const campaigns = await db.collection("campaigns").find({}).toArray();

    return NextResponse.json(campaigns);
  } catch (err) {
    console.error("❌ GET /campaigns failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🔹 POST new campaign (with image upload)
export async function POST(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

    const contentType = req.headers.get("content-type") || "";

    let newCampaign: Campaign = {};
    let imageBase64 = "";

    // 🧩 If form data (with image)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      newCampaign.title = formData.get("title") as string;
      newCampaign.passage = formData.get("passage") as string;
      newCampaign.amount = formData.get("amount") as string;
      newCampaign.detail = formData.get("detail") as string;

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        imageBase64 = `data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`;
        newCampaign.image = imageBase64;
      }
    } 
    // 🧩 If plain JSON (no image)
    else {
      const data = await req.json();
      newCampaign = data as Campaign;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("campaigns").insertOne({
      ...newCampaign,
      createdAt: new Date(),
    });

    return NextResponse.json({ _id: result.insertedId, ...newCampaign });
  } catch (err) {
    console.error("❌ POST /campaigns failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🔹 PUT update an existing campaign (image optional — kept if none uploaded)
export async function PUT(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

    const contentType = req.headers.get("content-type") || "";

    let id = "";
    const updates: Campaign = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = (formData.get("id") as string) || "";

      updates.title = (formData.get("title") as string) ?? "";
      updates.passage = (formData.get("passage") as string) ?? "";
      updates.amount = (formData.get("amount") as string) ?? "";
      updates.detail = (formData.get("detail") as string) ?? "";

      // Only replace the image when a new file was actually chosen.
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        updates.image = `data:${imageFile.type};base64,${Buffer.from(bytes).toString("base64")}`;
      }
    } else {
      const { id: bodyId, ...rest } = await req.json();
      id = bodyId;
      Object.assign(updates, rest as Campaign);
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid campaign id" }, { status: 400 });
    }

    if (!updates.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection("campaigns")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const updated = await db.collection("campaigns").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ PUT /campaigns failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🔹 DELETE campaign by ID
export async function DELETE(req: Request) {
  try {
    const denied = await requireContentEditor();
    if (denied) return denied;

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection("campaigns")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: result.deletedCount === 1 });
  } catch (err) {
    console.error("❌ DELETE /campaigns failed:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
