import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all users with the role of 'TEACHER'
export async function GET() {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true, // Make sure email is selected
        // ✅ ADD THIS SECTION TO INCLUDE THE COUNT
        _count: {
          select: {
            ledCourses: true, // This counts the courses the teacher leads
          },
        },
      },
      orderBy: { firstName: "asc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("GET Teachers Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
