import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notification"; // New import

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { submissionId } = params;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            group: {
              include: {
                courses: true,
              },
            },
            teacher: true,
          },
        },
        student: true,
        status: true,
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
    console.error("Submission Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { submissionId } = params;
    const { grade, feedback } = await req.json();

    if (grade === undefined || grade === null || grade === "") {
      return NextResponse.json({ error: "Grade is required" }, { status: 400 });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade: parseInt(grade, 10),
        feedback,
        status: "GRADED",
      },
      include: { // Include assignment and student to create notification
        assignment: true,
        student: true,
      },
    });

    // Create notification for the student
    if (updatedSubmission.student && updatedSubmission.assignment) {
      await createNotification(
        ["STUDENT"], // Target only students
        "SCORE_UPDATED",
        `Your assignment "${updatedSubmission.assignment.title}" has been graded. Score: ${updatedSubmission.grade}/${updatedSubmission.assignment.points}.`,
        `/student/assignments/${updatedSubmission.assignment.id}` // Link to assignment details page
      );
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Grade Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to grade submission" },
      { status: 500 }
    );
  }
}