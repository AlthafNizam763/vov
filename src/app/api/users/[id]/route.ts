import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// 🧩 Database connection
async function connectToDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Database not configured. Set MONGODB_URI.");
  }

  const { default: clientPromise } = await import("../../../../lib/mongodb");
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "admin";
  return client.db(dbName);
}

// ✅ The new correct context type for Next.js 15
interface Context {
  params: Promise<{ id: string }>;
}

// 🟢 GET — Fetch user by ID
export async function GET(_req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

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

// 🟢 PUT — Update user
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const { name, email, role, password } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const db = await connectToDb();

    const updateData: any = {
      name,
      email,
      role,
      updatedAt: new Date(),
    };

    if (password?.trim()) {
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

// 🟢 DELETE — Delete user
export async function DELETE(_req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const db = await connectToDb();

    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
