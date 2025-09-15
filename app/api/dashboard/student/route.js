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
      include: { courses: true },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        userId: studentId, // ✅ use userId instead of studentId
      },
    });

    const borrowedBooks = await prisma.libraryResource.findMany({
      where: {
        uploadedById: studentId, // ✅ this is "uploaded", not "borrowed"
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

    return NextResponse.json({
      myProfile: studentProfile,
      overallAttendance,
      borrowedBooks,
    });
  } catch (error) {
    console.error("Failed to fetch student dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
