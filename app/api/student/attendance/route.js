import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
  const user = await getLoggedInUser();

  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        group: {
          select: {
            name: true,
            course: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
