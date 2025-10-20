import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth"; // Import getLoggedInUser

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    let whereClause = {};

    // If the user is a FACULTY and heads at least one faculty, filter departments
    if (loggedInUser && loggedInUser.role === "FACULTY" && loggedInUser.headedFaculties && loggedInUser.headedFaculties.length > 0) {
      const facultyIds = loggedInUser.headedFaculties.map(faculty => faculty.id);
      whereClause = { facultyId: { in: facultyIds } };
    }

    const departments = await prisma.department.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            departmentCourses: true,
          },
        },
        faculty: true, // Include faculty information
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error("GET Departments Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, facultyId } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 });
    }

    const newDepartment = await prisma.department.create({
      data: {
        name,
        faculty: facultyId ? { connect: { id: facultyId } } : undefined,
      },
    });
    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error("POST Department Error:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
  }

  try {
    const { name, facultyId } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 });
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: {
        name,
        faculty: facultyId ? { connect: { id: facultyId } } : { disconnect: true },
      },
    });
    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error("PUT Department Error:", error);
    return NextResponse.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
  }

  try {
    const deletedDepartment = await prisma.department.delete({
      where: { id },
    });
    return NextResponse.json(deletedDepartment);
  } catch (error) {
    console.error("DELETE Department Error:", error);
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}