import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/staff - Get all staff members (ADMIN, HR, FACULTY, TEACHER)
export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "HR", "TEACHER"],
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        firstName: "asc",
      },
    });

    // Format the data for the frontend
    const formattedStaff = staff.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      email: s.email,
      role: s.role,
      department: s.department?.name || 'N/A',
    }));

    return NextResponse.json(formattedStaff, { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { message: "Failed to fetch staff", error: error.message },
      { status: 500 }
    );
  }
}