/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// 🟢 MongoDB connection helper
async function connectToDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ Missing MONGODB_URI in environment variables");
  }

  const { default: clientPromise } = await import("../../../../lib/mongodb");
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "VOV";
  return client.db(dbName);
}

// 🟢 GET — Fetch user by ID
export async function GET(_request: NextRequest, context: any) {
  try {
    const id = context.params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const db = await connectToDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

// 🟢 PUT — Update user by ID
export async function PUT(request: NextRequest, context: any) {
  try {
    const id = context.params.id;
    const { name, email, role, password } = await request.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const db = await connectToDb();

    const updateData: {
      name: string;
      email: string;
      role: string;
      updatedAt: Date;
      password?: string;
    } = {
      name,
      email,
      role,
      updatedAt: new Date(),
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      updateData.password = hashedPassword;
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

// 🟢 DELETE — Delete user by ID
export async function DELETE(_request: NextRequest, context: any) {
  try {
    const id = context.params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const db = await connectToDb();
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
