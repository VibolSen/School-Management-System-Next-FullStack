import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// This function's only job is to get all users with the role of 'TEACHER'
export async function GET() {
  try {
    const teachers = await prisma.user.findMany({
      where: {
        role: "TEACHER", // This filter is the most important part
      },
      select: {
        // We only select the data we need on the frontend
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        firstName: "asc", // Sort them alphabetically
      },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("GET Teachers API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
