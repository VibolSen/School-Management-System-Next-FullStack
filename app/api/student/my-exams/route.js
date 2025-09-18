import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all exam submissions for a specific student
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

    const examSubmissions = await prisma.examSubmission.findMany({
      where: { studentId },
      include: {
        exam: {
          include: {
            group: {
              select: { name: true },
            },
            teacher: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: {
        exam: {
          examDate: "asc",
        },
      },
    });

    return NextResponse.json(examSubmissions);
  } catch (error) {
    console.error("GET My Exams (Student) Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}
