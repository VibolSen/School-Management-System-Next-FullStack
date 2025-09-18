import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET function is already correct
export async function GET(req, { params }) {
  try {
    const { examSubmissionId } = params;
    const examSubmission = await prisma.examSubmission.findUnique({
      where: { id: examSubmissionId },
      include: {
        exam: {
          include: {
            teacher: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
    if (!examSubmission) {
      return NextResponse.json(
        { error: "Exam submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(examSubmission);
  } catch (error) {
    console.error("GET Exam Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam submission details" },
      { status: 500 }
    );
  }
}

// UPDATE an exam submission (Corrected Version)
export async function PUT(req, { params }) {
  try {
    // ✅ FIX: Await the request body *before* accessing params.
    const { content } = await req.json();
    const { examSubmissionId } = params;

    if (!content) {
      return NextResponse.json(
        { error: "Submission content cannot be empty" },
        { status: 400 }
      );
    }

    const updatedExamSubmission = await prisma.examSubmission.update({
      where: { id: examSubmissionId },
      data: {
        content,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        exam: {
          include: {
            teacher: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
    return NextResponse.json(updatedExamSubmission);
  } catch (error) {
    console.error("PUT Exam Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to submit exam" },
      { status: 500 }
    );
  }
}
