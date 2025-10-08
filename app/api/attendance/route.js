import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Ensure the logged-in user is authorized to view this attendance
    // For now, only allow users to view their own attendance or HR/Admin to view any staff's
    if (loggedInUser.id !== userId && loggedInUser.role !== 'ADMIN' && loggedInUser.role !== 'HR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceRecord = await prisma.staffAttendance.findFirst({
      where: {
        userId: userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { date: 'desc' }, // Get the latest record for today
    });

    if (attendanceRecord) {
      return NextResponse.json({ status: attendanceRecord.status, date: attendanceRecord.date }, { status: 200 });
    } else {
      return NextResponse.json(null, { status: 200 }); // No record for today
    }
  } catch (error) {
    console.error('Error fetching staff attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only non-student roles can use this staff attendance system
    if (loggedInUser.role === 'STUDENT') {
      return NextResponse.json({ error: 'Students cannot use staff attendance' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields: userId and action' }, { status: 400 });
    }

    if (loggedInUser.id !== userId) {
      return NextResponse.json({ error: 'Forbidden: Cannot record attendance for another user' }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.staffAttendance.findFirst({
      where: {
        userId: userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { date: 'desc' },
    });

    let newStatus;
    if (action === 'CHECK_IN') {
      if (existingAttendance && existingAttendance.status === 'CHECK_IN') {
        return NextResponse.json({ error: 'Already checked in' }, { status: 400 });
      }
      newStatus = 'PRESENT'; // Assuming CHECK_IN means PRESENT
    } else if (action === 'CHECK_OUT') {
      if (!existingAttendance || existingAttendance.status === 'ABSENT' || existingAttendance.status === 'LATE') {
        return NextResponse.json({ error: 'Cannot check out without checking in first' }, { status: 400 });
      }
      newStatus = 'ABSENT'; // Assuming CHECK_OUT means ABSENT for the day, or just a record of leaving
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedAttendance = await prisma.staffAttendance.upsert({
      where: {
        staff_attendance_unique: {
          userId: userId,
          date: today,
        },
      },
      update: {
        status: newStatus,
        date: new Date(), // Update timestamp to current time
      },
      create: {
        userId: userId,
        status: newStatus,
        date: new Date(),
      },
    });

    return NextResponse.json(updatedAttendance, { status: 200 });
  } catch (error) {
    console.error('Error recording staff attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}