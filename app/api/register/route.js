// /api/register/route.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ MODIFIED: The 'role' field will automatically default to 'STUDENT'
    // as defined in the Prisma schema. No need to specify it here.
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: userWithoutPassword,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred" }),
      { status: 500 }
    );
  }
}
