import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== 'FACULTY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ error: 'Role parameter is required' }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: role.toUpperCase(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
