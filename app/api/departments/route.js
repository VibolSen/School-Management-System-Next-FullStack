import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            departmentCourses: true,
          },
        },
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

