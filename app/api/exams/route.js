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

  try {
    let exams;
    if (userRole === "ADMIN") {
      exams = await prisma.exam.findMany({
        include: {
          group: { select: { id: true, name: true } },
          teacher: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    } else if (userRole === "TEACHER") {
      exams = await prisma.exam.findMany({
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

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
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
    const { title, description, examDate, groupId, teacherId: requestTeacherId } = body;

    if (!title || !examDate || !groupId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let finalTeacherId = requestTeacherId;

    // If a teacher is creating, assign themselves as the teacher and validate group
    if (userRole === "TEACHER") {
      if (!loggedInUser.groupIds.includes(groupId)) { // Assuming groupIds is available on loggedInUser
        return new NextResponse("Forbidden: Teacher can only assign exams to their assigned groups.", { status: 403 });
      }
      finalTeacherId = userId;
    } else if (userRole === "ADMIN") {
      // If an admin is creating, teacherId must be provided in the body
      if (!requestTeacherId) {
        return new NextResponse("Teacher ID is required for admin to create an exam", { status: 400 });
      }
    }

    const newExam = await prisma.exam.create({
      data: {
        title,
        description,
        examDate: new Date(examDate),
        groupId,
        teacherId: finalTeacherId,
      },
    });
    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
