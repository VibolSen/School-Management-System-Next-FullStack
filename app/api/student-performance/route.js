import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        submissions: true,
        examSubmissions: true,
        attendances: true,
      },
    });

    const performanceData = students.map((student) => {
      const assignmentGrades = student.submissions.map((s) => s.grade).filter((g) => g !== null);
      const examGrades = student.examSubmissions.map((s) => s.grade).filter((g) => g !== null);
      
      const averageAssignmentGrade = assignmentGrades.length > 0 ? assignmentGrades.reduce((a, b) => a + b, 0) / assignmentGrades.length : 0;
      const averageExamGrade = examGrades.length > 0 ? examGrades.reduce((a, b) => a + b, 0) / examGrades.length : 0;

      const allGrades = [...assignmentGrades, ...examGrades];
      const averageGrade = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 0;

      const totalAttendance = student.attendances.length;
      const presentDays = student.attendances.filter(a => a.status === 'PRESENT').length;
      const attendanceRate = totalAttendance > 0 ? (presentDays / totalAttendance) * 100 : 0;

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        averageGrade: Math.round(averageGrade),
        attendanceRate: Math.round(attendanceRate),
        completedAssignments: student.submissions.length,
        averageAssignmentGrade: Math.round(averageAssignmentGrade),
        averageExamGrade: Math.round(averageExamGrade),
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
