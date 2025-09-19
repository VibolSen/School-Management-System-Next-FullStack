
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setHours(23, 59, 59, 999); // Set to the end of the current day

    const newSession = await prisma.staffAttendanceSession.create({
      data: {
        expiresAt: expiresAt,
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error("POST Staff Attendance Session Error:", error);
    return NextResponse.json(
      { error: "Failed to create staff attendance session" },
      { status: 500 }
    );
  }
}
