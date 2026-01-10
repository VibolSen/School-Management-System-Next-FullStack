import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getLoggedInUser();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let where = {};

    // If the logged-in user is a student, filter schedules by their assigned groups
    if (session.role === 'STUDENT' && session.groupIds && session.groupIds.length > 0) {
      where = {
        assignedToGroupId: {
          in: session.groupIds,
        },
      };
    } else if (session.role === 'TEACHER' && session.id) {
        where = {
            assignedToTeacherId: session.id,
        };
    }


    const schedules = await prisma.schedule.findMany({
      where, // Apply the filter
      include: {
        creator: true,
        assignedToTeacher: true,
        assignedToGroup: true,
        sessions: true,
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'STUDY_OFFICE')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, assignedToTeacherId, assignedToGroupId, isRecurring, startDate, endDate, daysOfWeek, sessions } = data;

    // Validate sessions
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json({ error: 'At least one session is required' }, { status: 400 });
    }

    const createdSchedule = await prisma.schedule.create({
      data: {
        title,
        isRecurring,
        startDate: startDate ? new Date(startDate) : null,
        endDate: isRecurring && endDate ? new Date(endDate) : null,
        daysOfWeek: isRecurring ? daysOfWeek : [],
        creatorId: session.id,
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

    return NextResponse.json(createdSchedule, { status: 201 });

  } catch (error) {
    console.error('Error creating schedule(s):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function DELETE(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'STUDY_OFFICE')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    await prisma.schedule.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({ message: 'Schedules deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
