
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const programs = await prisma.faculty.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error("GET Programs Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
