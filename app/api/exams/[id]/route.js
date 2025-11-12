import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (session.user.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = params;

  try {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!exam) {
      return new NextResponse("Exam not found", { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (session.user.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { title, description, examDate } = body;

    if (!title || !examDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        title,
        description,
        examDate: new Date(examDate),
      },
    });

    return NextResponse.json(updatedExam);
  } catch (error) {
    console.error("Error updating exam:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (session.user.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = params;

  try {
    await prisma.exam.delete({
      where: { id },
    });

    return new NextResponse("Exam deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
