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
      coursesByDept,
      groups,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({
        where: { role: { in: ["ADMIN", "HR", "FACULTY", "TEACHER"] } },
      }),
      prisma.department.count(),
      prisma.course.count(),
      prisma.group.count(),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.courseDepartment.findMany({
        include: {
          department: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.group.findMany({
        include: {
          _count: {
            select: { students: true },
          },
        },
      }),
    ]);

    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const departmentMap = departments.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {});

    const coursesByDepartmentMap = coursesByDept.reduce((acc, cd) => {
      const deptName = cd.department.name;
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {});

    const coursesByDepartment = Object.keys(coursesByDepartmentMap).map((name) => ({
      name,
      count: coursesByDepartmentMap[name],
    }));

    const studentsPerGroup = groups.map((g) => ({
      name: g.name,
      count: g._count.students,
    }));

    // Return the complete aggregated data
    return NextResponse.json({
      studentCount,
      staffCount,
      departmentCount,
      courseCount,
      groupCount,
      teacherCount,
      coursesByDepartment,
      studentsPerGroup,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
