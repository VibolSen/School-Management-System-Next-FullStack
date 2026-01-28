
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth"; // Import getLoggedInUser

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { submissionId } = await params;
    const { grade, feedback, status } = await req.json(); // Also allow status update

    if (grade === undefined || grade === null || grade === "") {
      return NextResponse.json({ error: "Grade is required" }, { status: 400 });
    }

    const existingSubmission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        exam: true, // Include exam to check teacherId
      },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Authorization check: Only admin or the exam's teacher can grade
    if (loggedInUser.role !== "ADMIN" && !(loggedInUser.role === "TEACHER" && existingSubmission.exam.teacherId === loggedInUser.id)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedSubmission = await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        grade: parseInt(grade, 10),
        feedback,
        status: status || "GRADED", // Allow status to be explicitly passed or default to GRADED
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

