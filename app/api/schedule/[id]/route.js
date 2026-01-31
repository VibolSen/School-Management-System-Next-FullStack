import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getLoggedInUser();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: id },
      include: {
        creator: true,
        assignedToTeacher: true,
        assignedToGroup: true,
        sessions: true, // Include associated sessions
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const session = await getLoggedInUser();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'STUDY_OFFICE')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: id },
      select: { creatorId: true },
    });

    if (!existingSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && session.id !== existingSchedule.creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const { title, assignedToTeacherId, assignedToGroupId, isRecurring, startDate, endDate, daysOfWeek, sessions } = data;

    // Validate sessions
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json({ error: 'At least one session is required' }, { status: 400 });
    }

    // Delete existing sessions for this schedule
    await prisma.session.deleteMany({
      where: { scheduleId: id },
    });

    // Update the schedule and create new sessions
    const updatedSchedule = await prisma.schedule.update({
      where: { id: id },
      data: {
        title,
        isRecurring,
        startDate: isRecurring ? new Date(startDate) : null,
        endDate: isRecurring ? new Date(endDate) : null,
        daysOfWeek: isRecurring ? daysOfWeek : [],
        assignedToTeacherId,
        assignedToGroupId,
        sessions: {
          create: sessions.map(s => ({
            startTime: new Date(`1970-01-01T${s.startTime}:00Z`), // Use a dummy date for time-only fields
            endTime: new Date(`1970-01-01T${s.endTime}:00Z`),   // Use a dummy date for time-only fields
          })),
        },
      },
      include: {
        sessions: true,
      },
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getLoggedInUser();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: id },
      select: { creatorId: true },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && session.id !== schedule.creatorId) {
      return NextResponse.json({ error: 'Unauthorized to delete this schedule' }, { status: 403 });
    }

    await prisma.schedule.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
