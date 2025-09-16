import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all courses assigned to a specific teacher
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    // 1. Find all courses led by this teacher
    const coursesLedByTeacher = await prisma.course.findMany({
      where: { teacherId },
      include: {
        department: true, // Include the department's data
        groups: {
          // Include the groups within the course
          include: {
            _count: {
              // For each group, count the students
              select: { students: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // 2. Process the data to get total student and group counts per course
    const processedCourses = coursesLedByTeacher.map((course) => {
      const groupCount = course.groups.length;
      const studentCount = course.groups.reduce(
        (sum, group) => sum + group._count.students,
        0
      );

      return {
        id: course.id,
        name: course.name,
        department: course.department,
        groupCount,
        studentCount,
      };
    });

    return NextResponse.json(processedCourses);
  } catch (error) {
    console.error("GET My Courses (Teacher) Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
