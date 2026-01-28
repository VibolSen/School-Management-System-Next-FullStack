import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createNotificationForUsers } from "@/lib/notification"; // Updated import

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
            teacher: { select: { id: true, firstName: true, lastName: true } }, // Include teacher ID for notification
          },
        },
        student: { select: { firstName: true, lastName: true } }, // Include student name for notification message
      },
    });

    // Create notification for the specific teacher who created the assignment
    if (updatedSubmission.assignment?.teacher && updatedSubmission.student) {
      await createNotificationForUsers(
        [updatedSubmission.assignment.teacher.id], // Only notify the assignment's teacher
        "ASSIGNMENT_SUBMITTED",
        `Student ${updatedSubmission.student.firstName} ${updatedSubmission.student.lastName} has submitted assignment "${updatedSubmission.assignment.title}".`,
        `/teacher/assignment/${updatedSubmission.assignmentId}`,
        ["TEACHER"] // Store role for filtering
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
