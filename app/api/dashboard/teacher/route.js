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
            _count: {
              select: { students: true },
            },
          },
        },
      },
    });

    // 2. Calculate metrics from the fetched data
    const totalCourses = ledCourses.length;
    let totalGroups = 0;
    let totalStudents = 0;

    ledCourses.forEach((course) => {
      totalGroups += course.groups.length;
      course.groups.forEach((group) => {
        totalStudents += group._count.students;
      });
    });

    // Extract the names of the courses for display
    const courseList = ledCourses.map((course) => ({
      id: course.id,
      name: course.name,
    }));

    return NextResponse.json({
      totalCourses,
      totalGroups,
      totalStudents,
      courseList,
    });
  } catch (error) {
    console.error("Teacher Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher dashboard data" },
      { status: 500 }
    );
  }
}
