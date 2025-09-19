
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: "Session ID and User ID are required" },
        { status: 400 }
      );
    }

    const session = await prisma.staffAttendanceSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 404 });
    }

    if (new Date() > new Date(session.expiresAt)) {
      return NextResponse.json({ error: "Session has expired" }, { status: 400 });
    }

    const presentStatus = await prisma.attendanceStatus.findUnique({
      where: { name: "Present" },
    });

    if (!presentStatus) {
      return NextResponse.json(
        { error: "'Present' status not found" },
        { status: 500 }
      );
    }

    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const newRecord = await prisma.attendance.create({
      data: {
        userId: userId,
        statusId: presentStatus.id,
        date: date,
        checkIn: now,
        staffAttendanceSessionId: sessionId,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("POST Staff Attendance Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Attendance already recorded for today" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to record staff attendance" },
      { status: 500 }
    );
  }
}
