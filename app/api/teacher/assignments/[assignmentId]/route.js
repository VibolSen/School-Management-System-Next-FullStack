import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function PUT(req, { params }) {
  const { assignmentId } = params;
  const { title, description, dueDate } = await req.json();

  try {
    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error("[API/TEACHER/ASSIGNMENTS] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}