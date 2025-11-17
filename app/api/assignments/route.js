import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth"; // Use custom JWT authentication

export async function GET(request) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = loggedInUser.role;
  const userId = loggedInUser.id;
  console.log("Assignments API - User Role:", userRole, "User ID:", userId);

  try {
    let assignments;
    if (userRole === "ADMIN") {
      console.log("ADMIN role detected. Attempting to fetch all assignments.");
      assignments = await prisma.assignment.findMany({
        include: {
          group: { select: { id: true, name: true } },
          teacher: { select: { id: true, firstName: true, lastName: true } },
        },
      });
      console.log("ADMIN fetched assignments count:", assignments.length);
    } else if (userRole === "TEACHER") {
      assignments = await prisma.assignment.findMany({
        where: {
          teacherId: userId,
          groupId: { in: loggedInUser.groupIds }, // Assuming groupIds is available on loggedInUser
        },
        include: {
          group: { select: { id: true, name: true } },
          teacher: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = loggedInUser.role;
  const userId = loggedInUser.id;

  if (userRole !== "ADMIN" && userRole !== "TEACHER") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, description, dueDate, points, groupId, teacherId: requestTeacherId } = body;

    if (!title || !dueDate || !groupId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let finalTeacherId = requestTeacherId;

    if (userRole === "TEACHER") {
      if (!loggedInUser.groupIds.includes(groupId)) { // Assuming groupIds is available on loggedInUser
        return new NextResponse("Forbidden: Teacher can only assign to their assigned groups.", { status: 403 });
      }
      finalTeacherId = userId;
    } else if (userRole === "ADMIN") {
      if (!requestTeacherId) {
        return new NextResponse("Teacher ID is required for admin to create an assignment", { status: 400 });
      }
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        points: parseInt(points),
        groupId,
        teacherId: finalTeacherId,
      },
    });
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
