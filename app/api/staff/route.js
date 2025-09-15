import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/staff - Get all staff members (admin, hr, and faculty only)
export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ["admin", "hr", "faculty"], // Now includes "hr"
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
        department: true,
        position: true,
        contactNumber: true,
        isActive: true,
        isLocked: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Flatten the role name for easier use in the frontend
    const formattedStaff = staff.map((s) => ({
      ...s,
      role: s.role.name,
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

// POST /api/admin/staff - Add new staff member
export async function POST(req) {
  try {
    const {
      name,
      email,
      password,
      roleId,
      department,
      position,
      contactNumber,
    } = await req.json();

    // Basic validation
    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash password before saving - You should use a proper hashing library like bcrypt
    // For demonstration, I'm just storing it directly.
    // In a real app: const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password; // Placeholder

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        department,
        position,
        contactNumber,
        isActive: true,
        isLocked: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
        department: true,
        position: true,
        contactNumber: true,
        isActive: true,
        isLocked: true,
        createdAt: true,
      },
    });

    const formattedStaff = { ...newStaff, role: newStaff.role.name };
    return NextResponse.json(formattedStaff, { status: 201 });
  } catch (error) {
    console.error("Error adding staff:", error);
    // Handle unique email constraint error
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Failed to add staff", error: error.message },
      { status: 500 }
    );
  }
}