// FILE: app/api/assignments/route.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const parseDate = (d) => (d ? new Date(d) : null);

// ===== GET Handler (Handles fetch requests) =====
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Get a single student's submission details
      const studentAssignment = await prisma.studentAssignment.findUnique({
        where: { id },
        include: {
          assignment: { include: { course: true } },
          student: true,
          groupAssignment: { include: { group: true } },
          status: true,
        },
      });
      if (!studentAssignment)
        return new Response(JSON.stringify({ error: "Assignment not found" }), {
          status: 404,
        });
      return new Response(JSON.stringify(studentAssignment), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all student assignment records for the main table
    const assignments = await prisma.studentAssignment.findMany({
      include: {
        assignment: { include: { course: true } },
        student: true,
        groupAssignment: { include: { group: true } },
        status: true,
      },
      // ✅ FIX: The problematic orderBy clause that causes crashes with null dates has been removed.
    });
    return new Response(JSON.stringify(assignments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET StudentAssignment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ===== POST Handler (Handles creating new assignments) =====
export async function POST(req) {
  try {
    const data = await req.json();
    const { title, description, dueDate, courseId, groupId, statusId } = data;

    if (!title || !courseId || !groupId || !statusId) {
      return new Response(
        JSON.stringify({
          error: "Title, Course, Group, and Status are required.",
        }),
        { status: 400 }
      );
    }

    const groupMembers = await prisma.groupMember.findMany({
      where: { groupId },
      select: { studentId: true },
    });
    if (groupMembers.length === 0) {
      return new Response(
        JSON.stringify({
          error: "The selected group has no students to assign.",
        }),
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const newAssignment = await tx.assignment.create({
        data: { title, description, dueDate: parseDate(dueDate), courseId },
      });
      const groupAssignment = await tx.groupAssignment.create({
        data: { assignmentId: newAssignment.id, groupId },
      });
      await tx.studentAssignment.createMany({
        data: groupMembers.map((member) => ({
          assignmentId: newAssignment.id,
          studentId: member.studentId,
          groupAssignmentId: groupAssignment.id,
          statusId: statusId,
        })),
      });
    });

    return new Response(
      JSON.stringify({ message: "Assignment created successfully." }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ===== PUT Handler (Handles updating/grading submissions) =====
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // StudentAssignment ID
    if (!id)
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
      });

    const data = await req.json();
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: { id },
    });
    if (!studentAssignment)
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404,
      });

    const result = await prisma.$transaction(async (tx) => {
      await tx.assignment.update({
        where: { id: studentAssignment.assignmentId },
        data: {
          title: data.title,
          description: data.description,
          dueDate: parseDate(data.dueDate),
          courseId: data.courseId,
        },
      });
      return tx.studentAssignment.update({
        where: { id },
        data: {
          statusId: data.statusId,
          grade: data.grade ? parseFloat(data.grade) : null,
          feedback: data.feedback,
          content: data.content,
          fileUrl: data.fileUrl,
          submittedAt: data.submittedAt
            ? parseDate(data.submittedAt)
            : undefined,
        },
      });
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// ===== DELETE Handler (Handles deleting assignments) =====
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentAssignmentId = searchParams.get("id");
    if (!studentAssignmentId)
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
      });

    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: { id: studentAssignmentId },
      select: { assignmentId: true },
    });

    if (studentAssignment?.assignmentId) {
      await prisma.assignment.delete({
        where: { id: studentAssignment.assignmentId },
      });
    } else {
      // Fallback for safety
      await prisma.studentAssignment.delete({
        where: { id: studentAssignmentId },
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE error:", error);
    if (error.code === "P2025") return new Response(null, { status: 204 });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
