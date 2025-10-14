import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notification"; // New import

const prisma = new PrismaClient();

// GET a single submission's details
export async function GET(req, { params }) {
  try {
    const { submissionId } = params;
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
    const { submissionId } = params;
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
            teacher: { select: { id: true, firstName: true, lastName: true } }, // Include teacher ID for notification
          },
        },
        student: { select: { firstName: true, lastName: true } }, // Include student name for notification message
      },
    });

    // Create notification for the teacher
    if (updatedSubmission.assignment?.teacher && updatedSubmission.student) {
      await createNotification(
        ["TEACHER"], // Target only teachers
        "ASSIGNMENT_SUBMITTED",
        `Student ${updatedSubmission.student.firstName} ${updatedSubmission.student.lastName} has submitted assignment "${updatedSubmission.assignment.title}".`,
        `/teacher/submissions/${updatedSubmission.id}` // Link to the submission details page for the teacher
      );
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("PUT Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
