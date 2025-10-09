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
    const { userId, date, status, checkOutTime } = body;

    if (!userId || !date || !status) {
      return NextResponse.json({ error: 'Missing required fields: userId, date, and status' }, { status: 400 });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Validate status against AttendanceStatus enum
    const validStatuses = ['PRESENT', 'ABSENT', 'LATE'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid attendance status' }, { status: 400 });
    }

    const updatedAttendance = await prisma.staffAttendance.upsert({
      where: {
        staff_attendance_unique: {
          userId: userId,
          checkInTime: targetDate, // Use checkInTime for unique constraint
        },
      },
      update: {
        status: status,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
      },
      create: {
        userId: userId,
        status: status,
        checkInTime: targetDate,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
      },
    });

    return NextResponse.json(updatedAttendance, { status: 200 });
  } catch (error) {
    console.error('Error manually updating staff attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
