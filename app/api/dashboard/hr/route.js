import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ['Admin', 'Faculty', 'HR', 'Teacher'],
          },
        },
      },
    });

    const totalStaff = staff.length;
    const activeStaff = staff.filter((s) => s.isActive).length;
    const onLeave = staff.filter((s) => s.status === 'On Leave').length; // Assuming you have a status field

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const newHires = staff.filter((s) => new Date(s.createdAt) > threeMonthsAgo).length;

    const staffByDept = await prisma.user.groupBy({
      by: ['department'],
      _count: {
        _all: true,
      },
      where: {
        role: {
          name: {
            in: ['Admin', 'Faculty', 'HR', 'Teacher'],
          },
        },
        department: {
          not: null,
        },
      },
    });

    const staffByStatus = await prisma.user.groupBy({
      by: ['isActive'],
      _count: {
        _all: true,
      },
      where: {
        role: {
          name: {
            in: ['Admin', 'Faculty', 'HR', 'Teacher'],
          },
        },
      },
    });

    return NextResponse.json({
      totalStaff,
      activeStaff,
      onLeave,
      newHires,
      staffByDept: staffByDept.map((d) => ({ name: d.department, count: d._count._all })),
      staffByStatus: staffByStatus.map((s) => ({ name: s.isActive ? 'Active' : 'Inactive', value: s._count._all })),
    });
  } catch (error) {
    console.error('Failed to fetch HR dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
