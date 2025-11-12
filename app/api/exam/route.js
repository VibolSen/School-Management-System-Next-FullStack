import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// GET all exams or a single exam by id
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userRole = session.user.role;
    const userId = session.user.id;

    if (id) {
      // Fetch a single exam
      const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
          group: { select: { name: true, studentIds: true } },
          teacher: { select: { firstName: true, lastName: true } },
        },
      });

      if (!exam) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
      }

      // Authorization for single exam
      if (userRole === "admin") {
        return NextResponse.json(exam);
      } else if (userRole === "teacher" && exam.teacherId === userId) {
        return NextResponse.json(exam);
      } else if (userRole === "student" && exam.group.studentIds.includes(userId)) {
        return NextResponse.json(exam);
      } else {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } else {
      // Fetch multiple exams
      if (userRole === "admin") {
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
      } else if (userRole === "teacher") {
        const exams = await prisma.exam.findMany({
          where: { teacherId: userId },
          include: {
            group: { select: { name: true } },
            teacher: { select: { firstName: true, lastName: true } },
          },
          orderBy: {
            examDate: "desc",
          },
        });
        return NextResponse.json(exams);
      } else {
        // Students should not be able to fetch all exams
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
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
    const { title, description, examDate, groupId, teacherId: requestTeacherId } = await req.json();

    if (!title || !groupId) {
      return NextResponse.json(
        { error: "Title and Group ID are required" },
        { status: 400 }
      );
    }

    let finalTeacherId = requestTeacherId;

    // If a teacher is creating, assign themselves as the teacher
    if (userRole === "teacher") {
      finalTeacherId = userId;
    } else if (userRole === "admin") {
      // If an admin is creating, teacherId must be provided in the body
      if (!requestTeacherId) {
        return NextResponse.json(
          { error: "Teacher ID is required for admin to create an exam" },
          { status: 400 }
        );
      }
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
        teacher: { connect: { id: finalTeacherId } },
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Exam ID is required for updating.", { status: 400 });
    }

    const existingExam = await prisma.exam.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!existingExam) {
      return new NextResponse("Exam not found.", { status: 404 });
    }

    // Authorization
    if (userRole !== "admin" && !(userRole === "teacher" && existingExam.teacherId === userId)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const data = await req.json();

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        examDate: data.examDate ? new Date(data.examDate) : undefined,
      },
    });

    return NextResponse.json(updatedExam, { status: 200 });
  } catch (error) {
    console.error("PUT /api/exam Error:", error);
    if (error.code === "P2025") {
      return new NextResponse("Exam not found.", { status: 404 });
    }
    return new NextResponse("An internal server error occurred.", { status: 500 });
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Exam ID is required for deletion.", { status: 400 });
    }

    const existingExam = await prisma.exam.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!existingExam) {
      return new NextResponse("Exam not found.", { status: 404 });
    }

    // Authorization
    if (userRole !== "admin" && !(userRole === "teacher" && existingExam.teacherId === userId)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Before deleting the exam, delete all related exam submissions
    await prisma.examSubmission.deleteMany({
      where: { examId: id },
    });

    await prisma.exam.delete({
      where: { id },
    });

    return new NextResponse("Exam deleted successfully.", { status: 200 });
  } catch (error) {
    console.error("DELETE /api/exam Error:", error);
    if (error.code === "P2025") {
      return new NextResponse("Exam not found.", { status: 404 });
    }
    return new NextResponse("An internal server error occurred.", { status: 500 });
  }
}