import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN and STUDY_OFFICE roles can fetch all teachers
    if (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "STUDY_OFFICE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: { firstName: "asc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("GET /api/teacher Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
