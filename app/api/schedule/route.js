import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getLoggedInUser();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedules = await prisma.schedule.findMany({
      include: {
        creator: true,
        assignedToTeacher: true,
        assignedToGroup: true,
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

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, startTime, endTime, date, assignedToTeacherId, assignedToGroupId } = data;

    const schedule = await prisma.schedule.create({
      data: {
        title,
        startTime,
        endTime,
        date,
        creatorId: session.id,
        assignedToTeacherId,
        assignedToGroupId,
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, title, startTime, endTime, date, assignedToTeacherId, assignedToGroupId } = data;

    if (!id) {
      return NextResponse.json({ error: 'Schedule ID is required for PUT request' }, { status: 400 });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        title,
        startTime,
        endTime,
        date,
        assignedToTeacherId,
        assignedToGroupId,
      },
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== 'ADMIN') {
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
