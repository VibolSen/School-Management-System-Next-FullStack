// app/api/departments/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

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
    if (error.code === 'P2002') {
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
    if (error.code === 'P2002') {
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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    await prisma.department.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Department Error:", error);
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}