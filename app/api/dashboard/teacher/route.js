import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    // 1. Find all courses led by this teacher
    const ledCourses = await prisma.course.findMany({
      where: { teacherId: teacherId },
      include: {
        groups: {
          include: {
            students: {
              // Go deep to find the students in each group
              select: { id: true }, // We only need the ID for counting
            },
          },
        },
      },
    });

    // 2. Calculate the metrics
    const totalCourses = ledCourses.length;
    const studentIdSet = new Set(); // Use a Set to count unique students

    ledCourses.forEach((course) => {
      course.groups.forEach((group) => {
        group.students.forEach((student) => {
          studentIdSet.add(student.id);
        });
      });
    });

    const totalStudents = studentIdSet.size;

    return NextResponse.json({
      totalCourses,
      totalStudents,
    });
  } catch (error) {
    console.error("Teacher Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher dashboard data" },
      { status: 500 }
    );
  }
}
