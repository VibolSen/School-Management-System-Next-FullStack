import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const [
      studentCount,
      teacherCount,
      courseCount,
      departmentCount,
      facultyCount,
      groupCount,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.course.count(),
      prisma.department.count(),
      prisma.faculty.count(),
      prisma.group.count(),
    ]);

    const dashboardData = {
      studentCount,
      teacherCount,
      courseCount,
      departmentCount,
      facultyCount,
      groupCount,
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Error fetching study office dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
