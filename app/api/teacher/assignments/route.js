import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all assignments created by a specific teacher
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const assignments = await prisma.assignment.findMany({
      where: { teacherId },
      include: {
        group: {
          select: { name: true }, // Include the group name
        },
        _count: {
          // Count how many submissions have been made vs. total
          select: {
            submissions: {
              where: { status: { not: "PENDING" } }, // Count only SUBMITTED or GRADED
            },
          },
        },
      },
      orderBy: { dueDate: "desc" },
    });

    // We need to get the total number of students for each assignment's group
    const assignmentsWithStudentCount = await Promise.all(
      assignments.map(async (assignment) => {
        const group = await prisma.group.findUnique({
          where: { id: assignment.groupId },
          select: { _count: { select: { students: true } } },
        });
        return {
          ...assignment,
          totalStudents: group._count.students,
        };
      })
    );

    return NextResponse.json(assignmentsWithStudentCount);
  } catch (error) {
    console.error("GET Teacher Assignments Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

// CREATE a new assignment and generate pending submissions for all students in the group
export async function POST(req) {
  try {
    const { title, description, dueDate, groupId, teacherId } =
      await req.json();
    if (!title || !groupId || !teacherId) {
      return NextResponse.json(
        { error: "Title, Group ID, and Teacher ID are required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { studentIds: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        teacher: { connect: { id: teacherId } },
        group: { connect: { id: groupId } },
      },
    });

    // Now, create the submissions for each student in the group
    if (newAssignment && group.studentIds.length > 0) {
      await prisma.submission.createMany({
        data: group.studentIds.map((studentId) => ({
          assignmentId: newAssignment.id,
          studentId: studentId,
          status: "PENDING",
        })),
      });
    }

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("POST Assignment Error:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
