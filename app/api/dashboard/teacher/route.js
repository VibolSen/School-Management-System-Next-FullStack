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

    // 2. Calculate the metrics
    const totalCourses = await prisma.course.count({
      where: {
        teacherId: teacherId,
      },
    });
    const totalStudents = await prisma.user.count({
      where: {
        role: 'STUDENT',
        groups: {
          some: {
            course: {
              teacherId: teacherId,
            },
          },
        },
      },
    });

    const totalGroups = await prisma.group.count({
      where: {
        course: {
          teacherId: teacherId,
        },
      },
    });

    return NextResponse.json({
      totalCourses,
      totalStudents,
      totalGroups,
    });
  } catch (error) {
    console.error("Teacher Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher dashboard data" },
      { status: 500 }
    );
  }
}
