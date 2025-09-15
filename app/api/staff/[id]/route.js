import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/staff/[id] - Get a single staff member by ID
export async function GET(req, { params }) {
  const { id } = params;
  try {
    const staffMember = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        department: true,
        position: true,
        contactNumber: true,
        isActive: true,
        isLocked: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!staffMember) {
      return NextResponse.json(
        { message: "Staff member not found" },
        { status: 404 }
      );
    }

    const formattedStaff = {
      ...staffMember,
      roleId: staffMember.role.id,
      role: staffMember.role.name,
    };
    return NextResponse.json(formattedStaff, { status: 200 });
  } catch (error) {
    console.error(`Error fetching staff member ${id}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch staff member", error: error.message },
      { status: 500 }
    );
  }
}

// PUT or PATCH /api/admin/staff/[id] - Update a staff member by ID
export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const {
      name,
      email,
      password,
      roleId,
      department,
      position,
      contactNumber,
      isActive,
      isLocked,
    } = await req.json();

    const updateData = {
      name,
      email,
      roleId,
      department,
      position,
      contactNumber,
      isActive,
      isLocked,
    };

    // Only update password if provided
    if (password) {
      // Hash password before saving
      // In a real app: updateData.password = await bcrypt.hash(password, 10);
      updateData.password = password; // Placeholder
    }

    const updatedStaff = await prisma.user.update({
      where: { id },
      data: updateData,
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
        updatedAt: true,
      },
    });

    const formattedStaff = { ...updatedStaff, role: updatedStaff.role.name };
    return NextResponse.json(formattedStaff, { status: 200 });
  } catch (error) {
    console.error(`Error updating staff member ${id}:`, error);
    // Handle unique email constraint error
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update staff member", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/staff/[id] - Delete a staff member by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Staff member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting staff member ${id}:`, error);
    // Handle case where staff member might not exist
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Staff member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete staff member", error: error.message },
      { status: 500 }
    );
  }
}
