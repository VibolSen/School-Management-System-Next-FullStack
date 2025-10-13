import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createNotification } from "@/lib/notification"; // New import

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

// GET announcements for a course
export async function GET(req, { params }) {
  const { courseId } = params;

  try {
    const announcements = await prisma.announcement.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("GET Announcements Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// POST a new announcement to a course
export async function POST(req, { params }) {
  const user = await getUser(req);
  if (!user || (user.role !== "ADMIN" && user.role !== "FACULTY")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { courseId } = params;

  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    );
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        course: { connect: { id: courseId } },
        author: { connect: { id: user.id } },
      },
      include: {
        course: {
          select: { name: true, enrollments: { select: { studentId: true } } },
        },
      },
    });

    // Create notifications for all students enrolled in the course
    if (newAnnouncement.course && newAnnouncement.course.enrollments.length > 0) {
      for (const enrollment of newAnnouncement.course.enrollments) {
        await createNotification(
          enrollment.studentId,
          "NEW_ANNOUNCEMENT",
          `New announcement in "${newAnnouncement.course.name}": "${newAnnouncement.title}" `,
          `/student/courses/${courseId}` // Link to course details page
        );
      }
    }

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("POST Announcement Error:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
