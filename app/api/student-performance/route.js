import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        attendances: { include: { status: true } },
        submissions: true,
        examSubmissions: true,
      },
    });

    const performanceData = students.map((student) => {
      const totalAttendances = student.attendances.length;
      const presentAttendances = student.attendances.filter(
        (a) => a.status.name === "Present" || a.status.name === "Late"
      ).length;
      const attendanceRate = totalAttendances > 0 ? (presentAttendances / totalAttendances) * 100 : 0;

      const assignmentGrades = student.submissions.map((s) => s.grade).filter((g) => g !== null);
      const examGrades = student.examSubmissions.map((s) => s.grade).filter((g) => g !== null);
      const allGrades = [...assignmentGrades, ...examGrades];
      const averageGrade = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 0;

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        attendanceRate: Math.round(attendanceRate),
        averageGrade: Math.round(averageGrade),
      };
    });

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error("[API/STUDENT-PERFORMANCE] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
