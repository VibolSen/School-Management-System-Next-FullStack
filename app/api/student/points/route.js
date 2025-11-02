
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET() {
  const user = await getLoggedInUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const points = await prisma.point.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(points);
  } catch (error) {
    console.error('Error fetching points:', error);
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
  }
}
