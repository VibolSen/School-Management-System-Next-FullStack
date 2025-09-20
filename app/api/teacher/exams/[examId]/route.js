
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { examId } = params;

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
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

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("[API/TEACHER/EXAMS] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { examId } = params;
  const { title, description, examDate } = await req.json();

  try {
    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        title,
        description,
        examDate: examDate ? new Date(examDate) : null,
      },
    });
    return NextResponse.json(updatedExam);
  } catch (error) {
    console.error("[API/TEACHER/EXAMS] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { examId } = params;

  try {
    await prisma.exam.delete({
      where: { id: examId },
    });
    return NextResponse.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("[API/TEACHER/EXAMS] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
