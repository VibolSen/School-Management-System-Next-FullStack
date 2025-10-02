import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

// Helper function to get user from token
async function getUser(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

// GET function (no changes)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    const user = await getUser(req);

    let whereClause = {};
    if (teacherId) {
      whereClause.teacherId = teacherId;
    }

    // If the user is not an admin or faculty, they can only see their own courses
    if (user && user.role !== "ADMIN" && user.role !== "FACULTY") {
      whereClause.teacherId = user.id;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
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

// POST function (with authorization)
export async function POST(req) {
  const user = await getUser(req);
  if (!user || (user.role !== "ADMIN" && user.role !== "FACULTY")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

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

// UPDATE function (with authorization)
export async function PUT(req) {
  const user = await getUser(req);
  if (!user || (user.role !== "ADMIN" && user.role !== "FACULTY")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

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

// DELETE function (with authorization)
export async function DELETE(req) {
  const user = await getUser(req);
  if (!user || (user.role !== "ADMIN" && user.role !== "FACULTY")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );

    const groupCount = await prisma.group.count({ where: { courseIds: { has: id } } });
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