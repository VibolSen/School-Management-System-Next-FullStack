import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const studentStatuses = await prisma.enrollmentStatusEnum.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(studentStatuses);
  } catch (error) {
    console.error("Error fetching student statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch student statuses" },
      { status: 500 }
    );
  }
}
