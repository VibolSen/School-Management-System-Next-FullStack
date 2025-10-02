import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getLoggedInUser();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const userRole = session.role;

    let schedules = [];

    if (userRole === 'TEACHER') {
      schedules = await prisma.schedule.findMany({
        where: {
          assignedToTeacherId: userId,
        },
        include: {
          creator: true,
          assignedToGroup: true,
        },
      });
    } else if (userRole === 'STUDENT') {
      const student = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          groups: { select: { id: true } },
        },
      });

      if (student && student.groups.length > 0) {
        const groupIds = student.groups.map(group => group.id);
        schedules = await prisma.schedule.findMany({
          where: {
            assignedToGroupId: { in: groupIds },
          },
          include: {
            creator: true,
            assignedToGroup: true,
          },
        });
      }
    } else {
      return NextResponse.json({ error: 'Role not supported for personal schedules' }, { status: 403 });
    }

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching personal schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
