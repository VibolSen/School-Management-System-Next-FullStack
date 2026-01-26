import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.ADMIN, Role.HR, Role.TEACHER],
        },
      },
    });

    const totalStaff = staff.length;
    
    const staffByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        _all: true,
      },
      where: {
        role: {
          in: [Role.ADMIN, Role.HR, Role.TEACHER],
        },
      },
    });

    const totalTeachers = staffByRole.find(
      (roleCount) => roleCount.role === Role.TEACHER
    )?._count._all || 0;

    const totalDepartments = await prisma.department.count();

    const coursesByDept = await prisma.courseDepartment.groupBy({
      by: ['departmentId'],
      _count: {
        _all: true,
      },
    });

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

    const coursesByDepartment = coursesByDept.map((c) => ({
      name: departmentMap[c.departmentId],
      count: c._count._all,
    }));

    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    const studentsPerGroup = groups.map((g) => ({
      name: g.name,
      count: g._count.students,
    }));

    return NextResponse.json({
      totalStaff,
      totalTeachers,
      activeStaff: totalStaff, // Assuming all staff are active
      onLeave: 0, // No 'on leave' status in the schema
      newHires: 0, // No 'createdAt' field in the schema
      staffByDept: [], // No department field on user
      staffByStatus: staffByRole.map((s) => ({ name: s.role, value: s._count._all })),
      totalDepartments,
      coursesByDepartment,
      studentsPerGroup,
    });
  } catch (error) {
    console.error('Failed to fetch HR dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
