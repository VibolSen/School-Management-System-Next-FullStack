import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET a single submission's details
export async function GET(req, { params }) {
  try {
    const { submissionId } = await params;
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          // Include parent assignment details
          include: {
            teacher: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(submission);
  } catch (error) {
    console.error("GET Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission details" },
      { status: 500 }
    );
  }
}

// UPDATE a submission with the student's work
export async function PUT(req, { params }) {
  try {
    const { submissionId } = await params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Submission content cannot be empty" },
        { status: 400 }
      );
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        content,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        assignment: {
          include: {
            teacher: { select: { id: true, firstName: true, lastName: true } }, 
          },
        },
        student: { select: { firstName: true, lastName: true } }, 
      },
    });


    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("PUT Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
