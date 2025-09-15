import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET function (no changes)
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { name: "asc" },
      include: {
        department: true,
        teacher: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: {
          select: { groups: true },
        },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("GET Courses Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST function (no changes)
export async function POST(req) {
  try {
    const { name, departmentId, teacherId } = await req.json();
    if (!name || !departmentId) {
      return NextResponse.json(
        { error: "Course name and department ID are required" },
        { status: 400 }
      );
    }
    const dataToCreate = {
      name,
      department: { connect: { id: departmentId } },
    };
    if (teacherId) {
      dataToCreate.teacher = { connect: { id: teacherId } };
    }
    const newCourse = await prisma.course.create({ data: dataToCreate });
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A course with this name already exists." },
        { status: 409 }
      );
    }
    console.error("POST Course Error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

// UPDATE function (THIS IS THE CORRECTED VERSION)
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { name, departmentId, teacherId } = await req.json();

    if (!id || !name || !departmentId) {
      return NextResponse.json(
        { error: "Course ID, name, and department ID are required" },
        { status: 400 }
      );
    }

    // ✅ FIX IS HERE: Changed `departmentId` to the correct `department: { connect: ... }` syntax
    const dataToUpdate = {
      name,
      department: {
        connect: {
          id: departmentId,
        },
      },
    };

    if (teacherId) {
      dataToUpdate.teacher = { connect: { id: teacherId } };
    } else {
      dataToUpdate.teacher = { disconnect: true };
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedCourse);
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A course with this name already exists." },
        { status: 409 }
      );
    }
    console.error("PUT Course Error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE function (no changes)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );

    const groupCount = await prisma.group.count({ where: { courseId: id } });
    if (groupCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete course because it has ${groupCount} associated group(s).`,
        },
        { status: 409 }
      );
    }

    await prisma.course.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Course Error:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
