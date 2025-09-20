import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

export async function getLoggedInUser() {
  const tokenCookie = cookies().get("token");

  if (!tokenCookie) return null;

  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true, // Include departmentId
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to verify token or fetch user:", error);
    return null;
  }
}