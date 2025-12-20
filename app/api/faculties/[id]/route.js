
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: { id: params.id },
      include: {
        departments: true,
        head: true,
      },
    });
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }
    return NextResponse.json(faculty);
  } catch (error) {
    console.error("GET Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty" },
      { status: 500 }
    );
  }
}
