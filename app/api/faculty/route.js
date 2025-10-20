import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const faculties = await prisma.faculty.findMany({
      orderBy: { name: "asc" },
      include: {
        head: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        departments: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(faculties);
  } catch (error) {
    console.error("GET Faculties Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculties" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const { headId } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Faculty ID is required" }, { status: 400 });
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { id: id },
      data: { headId: headId },
    });

    if (!updatedFaculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error("PUT Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to update faculty" },
      { status: 500 }
    );
  }
}