import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';
import bcrypt from 'bcrypt';

// GET a single user by ID
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Authorization: ADMIN can get any user, HR can get any non-student, FACULTY can get STUDENTs
    if (
      loggedInUser.role === "ADMIN" ||
      (loggedInUser.role === "HR" && user.role !== "STUDENT") ||
      (loggedInUser.role === "FACULTY" && user.role !== "STUDENT") ||
      (loggedInUser.role === "STUDY_OFFICE") ||
      (loggedInUser.id === id)
    ) {
      return NextResponse.json(user);
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user', details: error.message }, { status: 500 });
  }
}

// PUT to update a user
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userToUpdate = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Authorization: ADMIN can update any user, HR can update any non-student
    if (
      loggedInUser.role !== "ADMIN" &&
      !(loggedInUser.role === "HR" && userToUpdate.role !== "STUDENT") &&
      !(loggedInUser.role === "STUDY_OFFICE" && userToUpdate.role === "STUDENT")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role, departmentId } = body;



    const data = {
      firstName,
      lastName,
      email,
      role,
      departmentId,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Authorization: ADMIN can delete any user, HR can delete any non-student
    if (
      loggedInUser.role !== "ADMIN" &&
      !(loggedInUser.role === "HR" && userToDelete.role !== "STUDENT") &&
      !(loggedInUser.role === "STUDY_OFFICE" && userToDelete.role === "STUDENT")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  }
}
