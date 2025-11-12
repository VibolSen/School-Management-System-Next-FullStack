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

  try {
    let exams;
    if (userRole === "admin") {
      exams = await prisma.exam.findMany({
        include: {
          group: { select: { id: true, name: true } },
          teacher: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    } else if (userRole === "teacher") {
      exams = await prisma.exam.findMany({
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

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
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
    const { title, description, examDate, groupId, teacherId: requestTeacherId } = body;

    if (!title || !examDate || !groupId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let finalTeacherId = requestTeacherId;

    // If a teacher is creating, assign themselves as the teacher and validate group
    if (userRole === "teacher") {
      if (!session.user.groupIds.includes(groupId)) {
        return new NextResponse("Forbidden: Teacher can only assign exams to their assigned groups.", { status: 403 });
      }
      finalTeacherId = userId;
    } else if (userRole === "admin") {
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
