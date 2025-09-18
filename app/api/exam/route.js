import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all exams or a single exam by id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
          group: { select: { name: true } },
          teacher: { select: { firstName: true, lastName: true } },
        },
      });

      if (!exam) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
      }

      return NextResponse.json(exam);
    }

    const exams = await prisma.exam.findMany({
      include: {
        group: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true } },
      },
      orderBy: {
        examDate: "desc",
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("GET Exams Error:", error);
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

    // Now, create the exam submissions for each student in the group
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

// =================================================================
// =====                PUT /api/exam (Update Exam)              =====
// =================================================================
/**
 * Updates an existing exam.
 * WARNING: This is INSECURE. It does not check who is making the update request.
 */
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return new Response(
        JSON.stringify({ error: "Exam ID is required for updating." }),
        { status: 400 }
      );

    // REMOVED: All security checks. Anyone who knows an exam ID can update it.
    const data = await req.json();

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        examDate: data.examDate ? new Date(data.examDate) : undefined,
      },
    });

    return new Response(JSON.stringify(updatedExam), { status: 200 });
  } catch (error) {
    console.error("PUT /api/exam Error:", error);
    if (error.code === "P2025")
      return new Response(JSON.stringify({ error: "Exam not found." }), {
        status: 404,
      });
    return new Response(
      JSON.stringify({ error: "An internal server error occurred." }),
      { status: 500 }
    );
  }
}

// =================================================================
// =====              DELETE /api/exam (Delete Exam)             =====
// =================================================================
/**
 * Deletes an exam.
 * WARNING: This is INSECURE. It does not check who is making the delete request.
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return new Response(
        JSON.stringify({ error: "Exam ID is required for deletion." }),
        { status: 400 }
      );

    // Before deleting the exam, delete all related exam submissions
    await prisma.examSubmission.deleteMany({
      where: { examId: id },
    });

    // REMOVED: All security checks. Anyone who knows an exam ID can delete it.
    await prisma.exam.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Exam deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/exam Error:", error);
    if (error.code === "P2025")
      return new Response(JSON.stringify({ error: "Exam not found." }), {
        status: 404,
      });
    return new Response(
      JSON.stringify({ error: "An internal server error occurred." }),
      { status: 500 }
    );
  }
}