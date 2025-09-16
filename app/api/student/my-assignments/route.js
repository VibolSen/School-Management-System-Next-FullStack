import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all submissions for a specific student
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

    // Query the Submission model for all records matching the student's ID
    const submissions = await prisma.submission.findMany({
      where: { studentId },
      // Include all the related details we need to display on the frontend
      include: {
        assignment: {
          // Get the parent assignment's details
          include: {
            group: {
              // Get the group the assignment was for
              select: { name: true },
            },
            teacher: {
              // Get the teacher's name
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      // Order by the assignment's due date, so the most urgent are first
      orderBy: {
        assignment: {
          dueDate: "asc",
        },
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("GET My Assignments (Student) Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
