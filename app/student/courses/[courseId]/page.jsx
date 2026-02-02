import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { InfoIcon, ArrowLeftIcon } from "lucide-react";
import StudentCourseDetailView from "@/components/course/StudentCourseDetailView";

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

  // Check for direct enrollment OR group-based enrollment
  const [directEnrollment, groupEnrollment] = await Promise.all([
    prisma.enrollment.findFirst({
      where: {
        studentId: loggedInUser.id,
        courseId: courseId,
      }
    }),
    prisma.group.findFirst({
      where: {
        studentIds: { has: loggedInUser.id },
        courseIds: { has: courseId }
      }
    })
  ]);

  const isAuthorized = directEnrollment || groupEnrollment || loggedInUser.role === 'ADMIN' || loggedInUser.role === 'TEACHER';

  if (!isAuthorized) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-red-100 shadow-sm text-center">
        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <InfoIcon size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-500 mt-2">You are not authorized to view this course page. Please contact your administrator if you believe this is an error.</p>
        <Link href="/student/courses" className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <ArrowLeftIcon size={16} className="mr-2" /> back to My Courses
        </Link>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-8">
      <StudentCourseDetailView courseId={courseId} loggedInUser={loggedInUser} />
    </div>
  );
}

