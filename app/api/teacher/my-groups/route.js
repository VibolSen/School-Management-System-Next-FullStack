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

    console.log("Fetching groups for teacherId:", teacherId);

    // Find all courses led by this teacher
    const coursesLedByTeacher = await prisma.course.findMany({
      where: {
        leadById: teacherId,
      },
      select: {
        groups: {
          select: { id: true, name: true },
        },
      },
    });

    // Extract unique groups from these courses
    const teacherGroups = coursesLedByTeacher.flatMap(course => course.groups);
    const uniqueTeacherGroups = Array.from(new Map(teacherGroups.map(group => [group.id, group])).values());

    console.log("Teacher's groups returned:", uniqueTeacherGroups);

    return NextResponse.json(uniqueTeacherGroups);

    console.log("Teacher's groups returned:", teacherGroups);

    return NextResponse.json(teacherGroups);
  } catch (error) {
    console.error("GET Teacher's Groups Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
