import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;
  console.log("Assignments API - User Role:", userRole, "User ID:", userId);

  try {
    let assignments;
    if (userRole === "admin") {
      console.log("Admin role detected. Attempting to fetch all assignments.");
      assignments = await prisma.assignment.findMany({
        include: {
          group: { select: { id: true, name: true } },
          teacher: { select: { id: true, firstName: true, lastName: true } },
        },
      });
      console.log("Admin fetched assignments count:", assignments.length);
    } else if (userRole === "teacher") {
      assignments = await prisma.assignment.findMany({
        where: {
          teacherId: userId,
          groupId: { in: session.user.groupIds },
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  if (userRole !== "admin" && userRole !== "teacher") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, description, dueDate, points, groupId, teacherId: requestTeacherId } = body;

    if (!title || !dueDate || !groupId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let finalTeacherId = requestTeacherId;

    if (userRole === "teacher") {
      if (!session.user.groupIds.includes(groupId)) {
        return new NextResponse("Forbidden: Teacher can only assign to their assigned groups.", { status: 403 });
      }
      finalTeacherId = userId;
    } else if (userRole === "admin") {
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
