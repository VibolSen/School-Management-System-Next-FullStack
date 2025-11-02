
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const points = await prisma.point.findMany({
      include: {
        user: true,
      },
    });
    return NextResponse.json(points);
  } catch (error) {
    console.error('Error fetching points:', error);
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, reason, points } = await request.json();
    const newPoint = await prisma.point.create({
      data: {
        userId,
        reason,
        points: parseInt(points, 10),
      },
    });
    return NextResponse.json(newPoint, { status: 201 });
  } catch (error) {
    console.error('Error creating point:', error);
    return NextResponse.json({ error: 'Failed to create point' }, { status: 500 });
  }
}
