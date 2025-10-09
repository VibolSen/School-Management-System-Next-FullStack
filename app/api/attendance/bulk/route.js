import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser || (loggedInUser.role !== 'ADMIN' && loggedInUser.role !== 'HR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userIds, date } = body;

    if (!userIds || !Array.isArray(userIds) || !date) {
      return NextResponse.json({ error: 'Missing required fields: userIds (array) and date' }, { status: 400 });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendanceRecords = await prisma.staffAttendance.findMany({
      where: {
        userId: {
          in: userIds,
        },
        checkInTime: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      select: {
        userId: true,
        status: true,
        checkInTime: true, // Select checkInTime instead of date
      },
    });

    // Format the records into an object for easier lookup on the frontend
    const formattedRecords = attendanceRecords.reduce((acc, record) => {
      acc[record.userId] = { status: record.status, date: record.checkInTime.toISOString().split('T')[0] }; // Convert to YYYY-MM-DD string
      return acc;
    }, {});

    return NextResponse.json(formattedRecords, { status: 200 });
  } catch (error) {
    console.error('Error fetching bulk staff attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
