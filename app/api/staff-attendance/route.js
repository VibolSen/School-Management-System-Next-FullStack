import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: ['HR', 'ADMIN', 'FACULTY', 'TEACHER'],
        },
      },
    });

    const attendanceData = await Promise.all(
      staff.map(async (user) => {
        const presentCount = await prisma.staffAttendance.count({
          where: {
            userId: user.id,
            status: 'PRESENT',
          },
        });

        const absentCount = await prisma.staffAttendance.count({
          where: {
            userId: user.id,
            status: 'ABSENT',
          },
        });

        return {
          name: `${user.firstName} ${user.lastName}`,
          present: presentCount,
          absent: absentCount,
        };
      })
    );

    return NextResponse.json(attendanceData);
  } catch (error) {
    console.error('Error fetching staff attendance data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
