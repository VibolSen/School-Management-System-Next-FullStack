import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

// Helper function to get user from token
async function getUser(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

// GET recent announcements for the logged-in user
export async function GET(req) {
  const user = await getUser(req);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    let courseIds = [];

    if (user.role === 'STUDENT') {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: user.id },
        select: { courseId: true },
      });
      courseIds = enrollments.map(e => e.courseId);
    } else if (user.role === 'ADMIN') {
      const courses = await prisma.course.findMany({
        where: {},
        select: { id: true },
      });
      courseIds = courses.map(c => c.id);
    }

    const announcements = await prisma.announcement.findMany({
      where: {
        courseId: { in: courseIds },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        course: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("GET Recent Announcements Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent announcements" },
      { status: 500 }
    );
  }
}
