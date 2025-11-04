import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

async function connectToDb() {
  // It's good practice to check for the database name as well.
  if (!process.env.MONGODB_DB) {
    throw new Error("Database not configured. Set MONGODB_DB.");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Database not configured. Set MONGODB_URI.");
  }
  const { default: clientPromise } = await import("../../../../lib/mongodb");
  const client = await clientPromise;
  return process.env.MONGODB_DB
    ? client.db(process.env.MONGODB_DB)
    : client.db();
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

// 🟢 GET — Get one user by ID
export async function GET(
  _request: NextRequest,
  { params: paramsPromise }: RouteContext
) {
  try {
    const { id } = await paramsPromise;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
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
    if (error instanceof Error && error.message.includes("Database not configured")) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }

    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// 🟢 PUT — Update user by ID
export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: RouteContext
) {
  try {
    const { id } = await paramsPromise;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

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
    if (error instanceof Error && error.message.includes("Database not configured")) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// 🟢 DELETE — Delete a user by ID
export async function DELETE(
  _request: NextRequest,
  { params: paramsPromise }: RouteContext
) {
  try {
    const { id } = await paramsPromise;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
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
    if (error instanceof Error && error.message.includes("Database not configured")) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }

    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
