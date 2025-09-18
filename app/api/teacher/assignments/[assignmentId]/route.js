import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET function (Correct - No changes needed)
export async function GET(req, { params }) {
  try {
    const { assignmentId } = params;
    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        group: { select: { name: true } },
        submissions: {
          include: {
            student: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { student: { firstName: "asc" } },
        },
      },
    });
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(assignment);
  } catch (error) {
    console.error("GET Single Assignment Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment details" },
      { status: 500 }
    );
  }
}

// PUT function (Correct - No changes needed)
export async function PUT(req, { params }) {
  try {
    const { title, description, dueDate } = await req.json();
    const { assignmentId } = params;
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Assignment title is required" },
        { status: 400 }
      );
    }
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
    console.error("Assignment Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    );
  }
}

// DELETE function (Corrected Version)
export async function DELETE(req, { params }) {
  try {
    const { assignmentId } = params;
    // First, delete all submissions related to the assignment
    await prisma.submission.deleteMany({
      where: { assignmentId: assignmentId },
    });
    // Then, delete the assignment itself
    await prisma.assignment.delete({
      where: { id: assignmentId },
    });
    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    // ✅ Added opening brace
    console.error("Assignment Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  } // ✅ Added closing brace
}
