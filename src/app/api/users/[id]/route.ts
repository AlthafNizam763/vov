import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// ✅ Properly type the context param used by route handlers
interface RouteContext {
  params: {
    id: string;
  };
}

// 🟢 GET — Get one user by ID
export async function GET(_request: Request, context: RouteContext) {
  try {
    const id = context.params.id;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } } // exclude password
      );

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// ✅ Interface for updating user data
interface UpdateData {
  name: string;
  email: string;
  role: string;
  updatedAt: Date;
  password?: string;
}

// 🟢 PUT — Update user by ID
export async function PUT(request: Request, context: RouteContext) {
  try {
    const id = context.params.id;
    const { name, email, role, password } = await request.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const updateData: UpdateData = {
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
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// 🟢 DELETE — Delete a user by ID
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const id = context.params.id;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
