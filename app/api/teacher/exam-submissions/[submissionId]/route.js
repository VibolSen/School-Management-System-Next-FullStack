
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const { submissionId } = params;
    const { grade, feedback } = await req.json();

    if (grade === undefined || grade === null || grade === "") {
      return NextResponse.json({ error: "Grade is required" }, { status: 400 });
    }

    const updatedSubmission = await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        grade: parseInt(grade, 10),
        feedback,
        status: "GRADED",
      },
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Grade Exam Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to grade exam submission" },
      { status: 500 }
    );
  }
}
