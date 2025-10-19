import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { courses: true }, // Include courses if needed
    });

    // Always return an array
    return new Response(JSON.stringify(students || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch students:", err);
    return new Response(JSON.stringify([]), { // return empty array on error
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const { userId, studentId, currentCourses, ...studentData } = await request.json();

    // Create the student record
    const newStudent = await prisma.student.create({
      data: {
        ...studentData,
        user: {
          connect: { id: userId },
        },
        studentId: studentId, // Ensure studentId is set
      },
    });

    // Connect to courses if provided
    if (currentCourses && currentCourses.length > 0) {
      await prisma.student.update({
        where: { id: newStudent.id },
        data: {
          courses: {
            connect: currentCourses.map(courseId => ({ id: courseId }))
          }
        }
      });
    }

    return new Response(JSON.stringify(newStudent), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return new Response(JSON.stringify({ error: "Failed to create student" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { currentCourses, ...studentData } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Student ID is required" }), { status: 400 });
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: studentData,
    });

    // Update courses if provided
    if (currentCourses) {
      // Disconnect all existing courses first
      await prisma.student.update({
        where: { id },
        data: {
          courses: { set: [] }
        }
      });
      // Connect new courses
      if (currentCourses.length > 0) {
        await prisma.student.update({
          where: { id },
          data: {
            courses: {
              connect: currentCourses.map(courseId => ({ id: courseId }))
            }
          }
        });
      }
    }

    return new Response(JSON.stringify(updatedStudent), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return new Response(JSON.stringify({ error: "Failed to update student" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: "Student ID is required" }), { status: 400 });
    }

    await prisma.student.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: "Student deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return new Response(JSON.stringify({ error: "Failed to delete student" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
