
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: true,
        department: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where: { courseId: courseId },
      orderBy: { date: "desc" },
    });

    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
      (r) => r.status === "Present"
    ).length;
    const overallAttendanceRate =
      totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    // Simplified completion rate - you might have more complex logic for this
    const completionRate = 75; // Placeholder

    // Attendance trend for the last 10 sessions
    const attendanceByDate = attendanceRecords.reduce((acc, record) => {
      const date = new Date(record.date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { total: 0, present: 0 };
      }
      acc[date].total++;
      if (record.status === "Present") {
        acc[date].present++;
      }
      return acc;
    }, {});

    const attendanceTrend = Object.entries(attendanceByDate)
      .slice(0, 10)
      .map(([date, data]) => ({
        date,
        "Attendance Rate": Math.round((data.present / data.total) * 100),
      }))
      .reverse();

    // Per-student attendance details
    const studentAttendance = course.enrollments.map((enrollment) => {
      const student = enrollment.student;
      const studentRecords = attendanceRecords.filter(
        (r) => r.studentId === student.id
      );
      const studentPresent = studentRecords.filter(
        (r) => r.status === "Present"
      ).length;
      const attendanceRate =
        studentRecords.length > 0
          ? Math.round((studentPresent / studentRecords.length) * 100)
          : 0;
      const lastRecord = studentRecords.length > 0 ? studentRecords[0] : null;

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        attendanceRate,
        lastStatus: lastRecord ? lastRecord.status : "N/A",
      };
    });

    const enrolledStudents = course.enrollments.map((e) => e.student);

    return NextResponse.json({
      course,
      enrolledStudents,
      overallAttendanceRate,
      presentCount,
      totalRecords,
      completionRate,
      attendanceTrend,
      studentAttendance,
    });
  } catch (error) {
    console.error("Failed to fetch course analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
