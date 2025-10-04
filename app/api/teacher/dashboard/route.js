import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get("teacherId");

  if (!teacherId) {
    return NextResponse.json({ error: "teacherId is required" }, { status: 400 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: { leadById: teacherId },
      include: {
        groups: { include: { students: true } },
      },
    });

    const studentsPerCourse = courses.map((course) => ({
      name: course.name,
      studentCount: course.groups.reduce((acc, group) => acc + group.students.length, 0),
    }));

    const studentIds = [...new Set(courses.flatMap((course) =>
      course.groups.flatMap((group) => group.students.map((student) => student.id))
    ))];

    const submissions = await prisma.submission.findMany({
      where: { studentId: { in: studentIds } },
    });

    const examSubmissions = await prisma.examSubmission.findMany({
      where: { studentId: { in: studentIds } },
    });

    const allGrades = [
      ...submissions.map((s) => s.grade).filter((g) => g !== null),
      ...examSubmissions.map((s) => s.grade).filter((g) => g !== null),
    ];

    const averageGrade = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 0;

    const gradeDistribution = allGrades.reduce((acc, grade) => {
      if (grade >= 90) {
        acc[0].count++;
      } else if (grade >= 80) {
        acc[1].count++;
      } else if (grade >= 70) {
        acc[2].count++;
      } else if (grade >= 60) {
        acc[3].count++;
      } else {
        acc[4].count++;
      }
      return acc;
    }, [
      { name: "A", count: 0 },
      { name: "B", count: 0 },
      { name: "C", count: 0 },
      { name: "D", count: 0 },
      { name: "F", count: 0 },
    ]);

    return NextResponse.json({
      studentsPerCourse,
      gradeDistribution,
      totalStudents: studentIds.length,
      totalCourses: courses.length,
      averageGrade: Math.round(averageGrade),
    });
  } catch (error) {
    console.error("[API/TEACHER/DASHBOARD] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
