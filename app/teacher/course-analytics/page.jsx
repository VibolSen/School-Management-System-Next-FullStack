import CourseAnalyticsView from "@/components/course/CourseAnalyticsView";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

async function getLoggedInUser() {
  const cookieStore = await cookies();
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
        departmentId: true, // Include departmentId
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to verify token or fetch user:", error);
    return null;
  }
}

export default async function CourseAnalyticsPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return (
      <div className="p-8">
        Error: Could not authenticate user. Please log in again.
      </div>
    );
  }

  return <CourseAnalyticsView loggedInUser={loggedInUser} />;
}
