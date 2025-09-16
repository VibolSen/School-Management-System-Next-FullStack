import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all unique students for a specific teacher
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

    // A multi-level query to find all students associated with a teacher's courses
    const coursesLedByTeacher = await prisma.course.findMany({
      where: { teacherId },
      include: {
        groups: {
          // Find all groups within those courses
          include: {
            students: {
              // Find all students within those groups
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Use a Map to ensure each student only appears once, even if they are
    // in multiple groups or courses taught by the same teacher.
    const uniqueStudentMap = new Map();
    coursesLedByTeacher.forEach((course) => {
      course.groups.forEach((group) => {
        group.students.forEach((student) => {
          uniqueStudentMap.set(student.id, student);
        });
      });
    });

    // Convert the Map values back to an array
    const uniqueStudents = Array.from(uniqueStudentMap.values());

    // Sort students alphabetically by first name
    uniqueStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));

    return NextResponse.json(uniqueStudents);
  } catch (error) {
    console.error("GET My Students (Teacher) Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
