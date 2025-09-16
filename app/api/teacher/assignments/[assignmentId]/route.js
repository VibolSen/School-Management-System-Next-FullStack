import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET a single assignment and all its submissions
export async function GET(req, { params }) {
  try {
    const { assignmentId } = params;
    if (!assignmentId)
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );

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

    if (!assignment)
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("GET Single Assignment Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment details" },
      { status: 500 }
    );
  }
}
