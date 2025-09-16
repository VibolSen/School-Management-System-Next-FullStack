import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const facultyId = searchParams.get("facultyId");

    if (!facultyId) {
      return NextResponse.json(
        { error: "Faculty ID is required" },
        { status: 400 }
      );
    }

    // 1. Find all courses led by this faculty member
    const ledCourses = await prisma.course.findMany({
      where: { teacherId: facultyId },
      include: {
        groups: {
          // For each course, include its groups
          include: {
            _count: {
              // For each group, count the students
              select: { students: true },
            },
          },
        },
      },
    });

    // 2. Calculate the metrics from the fetched data
    const totalCourses = ledCourses.length;
    let totalGroups = 0;
    let totalStudents = 0;
    const studentIdSet = new Set(); // Use a Set to count unique students

    ledCourses.forEach((course) => {
      totalGroups += course.groups.length;
      course.groups.forEach((group) => {
        // This logic for counting unique students is not fully supported by Prisma's aggregation yet.
        // For now, we'll sum the student counts from each group.
        // Note: This might double-count students if they are in multiple groups led by the same teacher.
        totalStudents += group._count.students;
      });
    });

    // Return the aggregated data
    return NextResponse.json({
      totalCourses,
      totalGroups,
      totalStudents,
    });
  } catch (error) {
    console.error("Faculty Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty dashboard data" },
      { status: 500 }
    );
  }
}
