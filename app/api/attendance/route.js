import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getLoggedInUser();

    if (!user || user.role !== 'STUDENT') {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const studentId = user.id;

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        group: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to fetch attendance' }), { status: 500 });
  }
}
