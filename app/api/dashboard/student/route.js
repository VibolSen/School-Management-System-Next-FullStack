import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AttendanceStatus } from "@/lib/types";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
    );
  }

  try {
    const studentProfile = await prisma.user.findUnique({
      where: { id: studentId },
      include: { enrollments: { include: { course: { include: { department: true, teacher: true, groups: true } } } }, groups: { include: { students: true } } },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        userId: studentId, // ✅ use userId instead of studentId
      },
    });



    const presentCount = attendance.filter(
      (r) =>
        r.status === AttendanceStatus.PRESENT ||
        r.status === AttendanceStatus.LATE
    ).length;

    const overallAttendance =
      attendance.length > 0
        ? `${Math.round((presentCount / attendance.length) * 100)}%`
        : "100%";

    const pendingAssignmentsCount = await prisma.submission.count({
      where: {
        studentId: studentId,
        status: 'PENDING',
      },
    });

    const pendingExamsCount = await prisma.examSubmission.count({
      where: {
        studentId: studentId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      myProfile: studentProfile,
      overallAttendance,
      pendingAssignmentsCount,
      pendingExamsCount,
    });
  } catch (error) {
    console.error("Failed to fetch student dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
