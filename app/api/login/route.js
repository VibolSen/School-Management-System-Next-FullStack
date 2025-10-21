// /api/login/route.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // ✅ MODIFIED: Include user's ID and ROLE in the JWT token payload
    const tokenPayload = {
      userId: user.id,
      role: user.role, // Add the role here
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });
    const { password: _, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ user: userWithoutPassword, token }), {
      status: 200,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
