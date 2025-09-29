
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

    const enrolledStudents = course.enrollments.map((e) => e.student);

    const completedCount = course.enrollments.filter(
      (e) => e.progress === 100
    ).length;
    const completionRate = enrolledStudents.length > 0
      ? (completedCount / enrolledStudents.length) * 100
      : 0;

    return NextResponse.json({
      course,
      enrolledStudents,
      completionRate: completionRate.toFixed(0),
    });
  } catch (error) {
    console.error("Failed to fetch course analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
