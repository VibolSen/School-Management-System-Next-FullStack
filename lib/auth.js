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
    console.log("JWT Payload:", payload);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
        groupIds: true, // Groups the user is a member of (still useful for students/general users)
        headedFaculties: {
          select: {
            id: true,
            name: true,
          },
        },
        // For teachers, also get groups from courses they lead
        ledCourses: {
          select: {
            groups: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    let finalUser = { ...user };

    // For TEACHER role, consolidate groupIds they are assigned to and groups from courses they lead
    if (user?.role === "TEACHER") {
      const teacherLedGroupIds = user.ledCourses
        ? user.ledCourses.flatMap((course) =>
            course.groups.map((group) => group.id)
          )
        : [];
      finalUser.groupIds = Array.from(
        new Set([...(user?.groupIds || []), ...teacherLedGroupIds])
      );
    }

    console.log("Fetched User:", finalUser);

    return finalUser;
  } catch (error) {
    console.error("Failed to verify token or fetch user:", error);
    return null;
  }
}
