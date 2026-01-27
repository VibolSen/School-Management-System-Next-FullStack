import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';
import bcrypt from 'bcrypt';

// GET a single user by ID
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
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
  const { id } = await params;
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userToUpdate = await prisma.user.findUnique({
      where: { id },
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

    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const password = formData.get("password");

    const data = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;

    // Handle image file separately
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      // This part needs to be implemented for image upload.
      // For now, we'll just log it and skip actual upload.
      console.log("Image file received for upload:", imageFile.name);
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
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
  const { id } = await params;
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Authorization checks for user deletion
    if (userToDelete.role === "ADMIN") {
      return NextResponse.json({ error: "Cannot delete an ADMIN user." }, { status: 403 });
    }

    if (loggedInUser.id === id && loggedInUser.role === "ADMIN") {
      return NextResponse.json({ error: "ADMIN users cannot delete themselves." }, { status: 403 });
    }

    // Existing authorization: ADMIN can delete any user, HR can delete any non-student
    if (
      loggedInUser.role !== "ADMIN" &&
      !(loggedInUser.role === "HR" && userToDelete.role !== "STUDENT") &&
      !(loggedInUser.role === "STUDY_OFFICE" && userToDelete.role === "STUDENT")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  }
}
