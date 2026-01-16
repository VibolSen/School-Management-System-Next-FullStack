import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { submissionId } = params;
    const { grade, feedback } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade: grade ? parseInt(grade) : null,
        feedback: feedback || null,
        status: "GRADED", // Assuming status changes to GRADED upon grading
      },
    });

    return NextResponse.json(updatedSubmission, { status: 200 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
