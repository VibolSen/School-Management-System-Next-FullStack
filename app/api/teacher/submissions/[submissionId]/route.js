import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createNotificationForUsers } from "@/lib/notification"; // Updated import

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { submissionId } = await params;

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
    const { submissionId } = await params;
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
      include: { 
        assignment: {
          include: {
            group: {
              include: {
                courses: true,
              },
            },
          },
        },
        student: true,
      },
    });

    // Create notification for the specific student who submitted
    if (updatedSubmission.student && updatedSubmission.assignment) {
      await createNotificationForUsers(
        [updatedSubmission.student.id], // Only notify the student who submitted
        "SCORE_UPDATED",
        `Your assignment "${updatedSubmission.assignment.title}" has been graded. Score: ${updatedSubmission.grade}/${updatedSubmission.assignment.points}.`,
        `/student/assignments/${updatedSubmission.assignment.id}`,
        ["STUDENT"] // Store role for filtering
      );
    }

    // Trigger progress update
    if (updatedSubmission.student && updatedSubmission.assignment.group.courses.length > 0) {
      const studentId = updatedSubmission.student.id;
      const courseId = updatedSubmission.assignment.group.courses[0].id; // Assuming one course per group for now

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/enrollments/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, courseId }),
      });
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