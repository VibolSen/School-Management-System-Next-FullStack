
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all courses a specific student is enrolled in
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: true, // Fetch progress
        groups: {
          include: {
            courses: {
              include: {
                courseDepartments: { include: { department: true } },
                leadBy: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create a map for quick progress lookup
    const progressMap = new Map(user.enrollments.map(e => [e.courseId, e.progress]));

    const coursesWithGroupInfo = user.groups.flatMap(group => 
      group.courses.map(course => ({ 
        ...course, 
        groupName: group.name,
        progress: progressMap.get(course.id) || 0 // Inject progress
      }))
    ).filter(Boolean);

    const uniqueCourses = Array.from(new Map(coursesWithGroupInfo.map(course => [course.id, course])).values());

    return NextResponse.json(uniqueCourses);
  } catch (error) {
    console.error("GET My Courses (Student) Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
