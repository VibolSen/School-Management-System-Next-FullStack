import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { groupId } = await params; // ✅ FIXED
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 }
    );
  }

  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        groupId,
        date: new Date(date),
      },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { groupId } = await params; // ✅ FIXED
  const body = await request.json();
  const { date, attendances } = body;

  if (!date || !attendances) {
    return NextResponse.json(
      { error: "Date and attendances are required" },
      { status: 400 }
    );
  }

  try {
    const transactions = attendances.map((att) =>
      prisma.attendance.upsert({
        where: {
          attendance_unique: {
            date: new Date(date),
            studentId: att.studentId,
            groupId,
          },
        },
        update: {
          status: att.status,
        },
        create: {
          date: new Date(date),
          status: att.status,
          studentId: att.studentId,
          groupId,
        },
      })
    );

    await prisma.$transaction(transactions);

    return NextResponse.json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}
