// app/api/departments/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      // ✅ MODIFIED: Include the count of related courses
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
    return NextResponse.json(departments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// CREATE a new department
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }
    const newDepartment = await prisma.department.create({
      data: { name },
    });
    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    // Handle unique constraint error
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return NextResponse.json(
        { error: "A department with this name already exists." },
        { status: 409 }
      );
    }
    console.error("POST Department Error:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}

// UPDATE an existing department
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "Department ID and name are required" },
        { status: 400 }
      );
    }
    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedDepartment);
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return NextResponse.json(
        { error: "A department with this name already exists." },
        { status: 409 }
      );
    }
    console.error("PUT Department Error:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}

// DELETE a department
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );

    // ✅ ADDED: Safety check to prevent deleting a department with courses
    const courseCount = await prisma.course.count({
      where: { departmentId: id },
    });
    if (courseCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete department because it has ${courseCount} associated course(s).`,
        },
        { status: 409 } // 409 Conflict
      );
    }

    await prisma.department.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
