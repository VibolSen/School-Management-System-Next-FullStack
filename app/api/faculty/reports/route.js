import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId");

  if (!departmentId) {
    return NextResponse.json(
      { error: "Department ID is required" },
      { status: 400 }
    );
  }

  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        departmentId: departmentId,
      },
      include: {
        submissions: true,
        examSubmissions: true,
        attendances: true,
      },
    });

    const studentPerformance = students.map((student) => {
      const assignmentGrades = student.submissions.map((sub) => sub.grade).filter(g => g !== null);
      const examGrades = student.examSubmissions.map((sub) => sub.grade).filter(g => g !== null);
      const allGrades = [...assignmentGrades, ...examGrades];
      const averageGrade = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 0;

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        grade: averageGrade,
      };
    });

    const attendanceData = await prisma.attendance.findMany({
        where: {
            student: {
                departmentId: departmentId,
            }
        }
    });

    const attendanceTrends = attendanceData.reduce((acc, att) => {
        const date = att.date.toISOString().split("T")[0];
        if (!acc[date]) {
            acc[date] = { date, present: 0, absent: 0 };
        }
        if (att.status === "PRESENT") {
            acc[date].present++;
        } else if (att.status === "ABSENT") {
            acc[date].absent++;
        }
        return acc;
    }, {});

    const classParticipation = students.map((student) => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      participation: student.submissions.length + student.examSubmissions.length,
    }));

    return NextResponse.json({
      studentPerformance,
      attendanceTrends: Object.values(attendanceTrends),
      classParticipation,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}