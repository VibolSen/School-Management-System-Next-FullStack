import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// UPDATE (Grade) a single submission
export async function PUT(req, { params }) {
  try {
    const { submissionId } = params;
    const { grade, feedback } = await req.json();

    if (grade === undefined || grade === null) {
      return NextResponse.json({ error: "Grade is required" }, { status: 400 });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade: parseInt(grade, 10), // Ensure grade is an integer
        feedback,
        status: "GRADED", // Update the status automatically
      },
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Grade Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to grade submission" },
      { status: 500 }
    );
  }
}
