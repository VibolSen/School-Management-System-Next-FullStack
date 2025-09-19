import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// GET all users or a single user by ID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role");

    if (id) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }
      const { password, ...userWithoutPassword } = user;
      return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
    }

    if (role) {
      const users = await prisma.user.findMany({ where: { role } });
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
      return new Response(JSON.stringify(usersWithoutPasswords), { status: 200 });
    }

    const users = await prisma.user.findMany();
    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
    return new Response(JSON.stringify(usersWithoutPasswords), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// CREATE a new user
export async function POST(req) {
  const data = await req.json();
  if (!data.firstName || !data.lastName || !data.email || !data.password) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword), { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({ error: "A user with this email already exists." }),
        { status: 409 }
      );
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// UPDATE an existing user
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  const data = await req.json();

  try {
    const updatePayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role, // ✅ This was the missing field
    };

    if (data.password && data.password.length > 0) {
      updatePayload.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatePayload,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return new Response(
        JSON.stringify({ error: "A user with this email already exists." }),
        { status: 409 }
      );
    }
    console.error("Update user error:", error);
    return new Response(JSON.stringify({ error: "Failed to update user." }), {
      status: 400,
    });
  }
}

// DELETE a user
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    const { password, ...userWithoutPassword } = deletedUser;
    return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
