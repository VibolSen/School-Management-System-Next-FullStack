import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // We run all count queries in parallel for maximum efficiency
    const [
      studentCount,
      staffCount,
      departmentCount,
      courseCount,
      groupCount,
      teacherCount,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({
        where: { role: { in: ["ADMIN", "HR", "FACULTY", "TEACHER"] } },
      }),
      prisma.department.count(),
      prisma.course.count(),
      prisma.group.count(),
      prisma.user.count({ where: { role: "TEACHER" } }),
    ]);

    // Return the complete aggregated data
    return NextResponse.json({
      studentCount,
      staffCount,
      departmentCount,
      courseCount,
      groupCount,
      teacherCount,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
