import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";

const prisma = new PrismaClient();

// GET all users with the role of 'TEACHER'
export async function GET() {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true, // Make sure email is selected
        // ✅ ADD THIS SECTION TO INCLUDE THE COUNT
        _count: {
          select: {
            ledCourses: true, // This counts the courses the teacher leads
          },
        },
      },
      orderBy: { firstName: "asc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("GET Teachers Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash password before storing (assuming bcrypt or similar is used elsewhere)
    // For now, storing as plain text, but in a real app, this should be hashed.
    const hashedPassword = password; // Placeholder for actual hashing

    const newTeacher = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'TEACHER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
