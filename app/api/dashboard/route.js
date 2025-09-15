// app/api/dashboard/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Perform all count queries in parallel for efficiency
    const [studentCount, staffCount, departmentCount, courseCount] =
      await Promise.all([
        // Count users with the role of STUDENT
        prisma.user.count({
          where: { role: "STUDENT" },
        }),
        // Count users with staff roles
        prisma.user.count({
          where: {
            role: {
              in: ["ADMIN", "HR", "FACULTY", "TEACHER"],
            },
          },
        }),
        // Count all departments
        prisma.department.count(),
        // Count all courses
        prisma.course.count(),
      ]);

    // Return the aggregated data
    return NextResponse.json({
      studentCount,
      staffCount,
      departmentCount,
      courseCount,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
