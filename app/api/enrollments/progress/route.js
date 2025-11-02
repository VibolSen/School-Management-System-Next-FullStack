import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

async function calculateCourseProgress(studentId, courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      groups: {
        include: {
          assignments: true,
          exams: true,
        },
      },
    },
  });

  if (!course) {
    return 0;
  }

  const assignments = course.groups.flatMap((g) => g.assignments);
  const exams = course.groups.flatMap((g) => g.exams);

  const totalPossiblePoints = 
    assignments.reduce((sum, a) => sum + (a.points || 100), 0) + 
    exams.length * 100; // Assume each exam is 100 points

  if (totalPossiblePoints === 0) {
    return 0;
  }

  const studentSubmissions = await prisma.submission.findMany({
    where: {
      studentId: studentId,
      assignmentId: { in: assignments.map((a) => a.id) },
      status: "GRADED",
    },
  });

  const studentExamSubmissions = await prisma.examSubmission.findMany({
    where: {
      studentId: studentId,
      examId: { in: exams.map((e) => e.id) },
      status: "GRADED",
    },
  });

  const earnedPoints = 
    studentSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) + 
    studentExamSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0);

  const progress = (earnedPoints / totalPossiblePoints) * 100;

  return Math.round(progress);
}

export async function POST(req) {
  try {
    const { studentId, courseId } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: "studentId and courseId are required" },
        { status: 400 }
      );
    }

    const progress = await calculateCourseProgress(studentId, courseId);

    const enrollment = await prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
      data: {
        progress: progress,
      },
    });

    if (progress === 100) {
      // Course completed, generate certificate
      const certificate = await prisma.certificate.create({
        data: {
          recipient: studentId,
          courseId: courseId,
          issueDate: new Date(),
          uniqueId: `${studentId}-${courseId}-${new Date().getTime()}`,
        },
      });
      console.log("Certificate generated:", certificate);
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
