import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    if (!teacherId)
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );

    // Find all courses led by the teacher, then get their groups
    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: {
        groups: {
          select: { id: true, name: true },
        },
      },
    });

    // Flatten the array of groups
    const teacherGroups = courses.flatMap((course) => course.groups);

    return NextResponse.json(teacherGroups);
  } catch (error) {
    console.error("GET Teacher's Groups Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
