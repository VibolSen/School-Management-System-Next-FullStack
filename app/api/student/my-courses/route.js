
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

    // Find the student and include their courses
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        courses: {
          include: {
            department: true,
            teacher: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student.courses);
  } catch (error) {
    console.error("GET My Courses (Student) Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
