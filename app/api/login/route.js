// /api/login/route.js
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

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

    const token = await new SignJWT({ userId: user.id, role: user.role.name })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(JWT_SECRET);

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
