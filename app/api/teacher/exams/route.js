import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all exams created by a specific teacher
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const exams = await prisma.exam.findMany({
      where: { teacherId },
      include: {
        group: {
          select: { name: true }, // Include the group name
        },
        _count: {
          // Count how many submissions have been made vs. total
          select: {
            submissions: {
              where: { status: { not: "PENDING" } }, // Count only SUBMITTED or GRADED
            },
          },
        },
      },
      orderBy: { examDate: "desc" },
    });

    // We need to get the total number of students for each exam's group
    const examsWithStudentCount = await Promise.all(
      exams.map(async (exam) => {
        const group = await prisma.group.findUnique({
          where: { id: exam.groupId },
          select: { _count: { select: { students: true } } },
        });
        return {
          ...exam,
          totalStudents: group._count.students,
        };
      })
    );

    return NextResponse.json(examsWithStudentCount);
  } catch (error) {
    console.error("GET Teacher Exams Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

// CREATE a new exam and generate pending submissions for all students in the group
export async function POST(req) {
  try {
    const { title, description, examDate, groupId, teacherId } =
      await req.json();
    if (!title || !groupId || !teacherId) {
      return NextResponse.json(
        { error: "Title, Group ID, and Teacher ID are required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { studentIds: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const newExam = await prisma.exam.create({
      data: {
        title,
        description,
        examDate: examDate ? new Date(examDate) : null,
        teacher: { connect: { id: teacherId } },
        group: { connect: { id: groupId } },
      },
    });

    // Now, create the submissions for each student in the group
    if (newExam && group.studentIds.length > 0) {
      await prisma.examSubmission.createMany({
        data: group.studentIds.map((studentId) => ({
          examId: newExam.id,
          studentId: studentId,
          status: "PENDING",
        })),
      });
    }

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error("POST Exam Error:", error);
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    );
  }
}
