
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
        checkInTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { checkInTime: 'desc' },
    });

    if (attendanceRecord) {
      return NextResponse.json(attendanceRecord, { status: 200 });
    } else {
      return NextResponse.json(null, { status: 200 });
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

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (action === 'CHECK_IN') {
      const existingAttendance = await prisma.staffAttendance.findFirst({
        where: {
          userId: userId,
          checkInTime: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (existingAttendance) {
        return NextResponse.json({ error: 'Already checked in for today' }, { status: 400 });
      }

      const workStartTime = new Date();
      workStartTime.setHours(8, 0, 0, 0);

      const lateMinutes = Math.max(0, Math.floor((now - workStartTime) / 60000));
      let status = 'PRESENT';
      let note = null;

      if (lateMinutes > 0) {
        status = 'LATE';
        note = `Late by ${lateMinutes} minutes.`;
      }

      const newAttendance = await prisma.staffAttendance.create({
        data: {
          userId: userId,
          checkInTime: now,
          status: status,
          lateMinutes: lateMinutes,
          note: note,
        },
      });

      return NextResponse.json(newAttendance, { status: 201 });

    } else if (action === 'CHECK_OUT') {
      const attendanceRecord = await prisma.staffAttendance.findFirst({
        where: {
          userId: userId,
          checkInTime: {
            gte: today,
            lt: tomorrow,
          },
          checkOutTime: null,
        },
        orderBy: { checkInTime: 'desc' },
      });

      if (!attendanceRecord) {
        return NextResponse.json({ error: 'No active check-in found for today' }, { status: 400 });
      }

      const updatedAttendance = await prisma.staffAttendance.update({
        where: {
          id: attendanceRecord.id,
        },
        data: {
          checkOutTime: now,
        },
      });

      return NextResponse.json(updatedAttendance, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error recording staff attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
