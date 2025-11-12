import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET_STRING = process.env.JWT_SECRET || "your-super-secret-key-that-is-long";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function getLoggedInUser() {
  const cookieStore = await cookies(); // ✅ must await now
  const tokenCookie = cookieStore.get("token");

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
        departmentId: true,
        groupIds: true,
        headedFaculties: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to verify token or fetch user:", error);
    return null;
  }
}
