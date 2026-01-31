import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import AnnouncementsView from "@/components/announcements/AnnouncementsView";

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
      select: { id: true, firstName: true, lastName: true, role: true },
    });
    return user;
  } catch (error) {
    console.error("Authentication Error:", error);
    return null;
  }
}

export default async function CourseDetailsPage({ params }) {
  const loggedInUser = await getLoggedInUser();
  const { courseId } = await params;

  if (!loggedInUser) {
    return (
      <div className="p-8">
        Error: Could not authenticate user. Please log in again.
      </div>
    );
  }

  // Optional: Add a check to ensure the student is enrolled in this course
  const enrollment = await prisma.enrollment.findFirst({
      where: {
          studentId: loggedInUser.id,
          courseId: courseId,
      }
  });

  if (!enrollment && loggedInUser.role !== 'ADMIN') {
      return (
          <div className="p-8">
              Error: You are not authorized to view this page.
          </div>
      );
  }


  return (
    <div>
      <AnnouncementsView courseId={courseId} loggedInUser={loggedInUser} />
    </div>
  );
}
