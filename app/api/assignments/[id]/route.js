import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth"; // Use custom JWT authentication

export async function GET(request, { params }) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Only allow admins and study office to fetch assignments by ID
  if (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "STUDY_OFFICE") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = params;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!assignment) {
      return new NextResponse("Assignment not found", { status: 404 });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Only allow admins to update assignments
  if (loggedInUser.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { title, description, dueDate, points, groupId } = body;

    if (!title || !dueDate || !groupId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        points: parseInt(points),
        groupId,
      },
    });

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Only allow admins to delete assignments
  if (loggedInUser.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = params;

  try {
    await prisma.assignment.delete({
      where: { id },
    });

    return new NextResponse("Assignment deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
