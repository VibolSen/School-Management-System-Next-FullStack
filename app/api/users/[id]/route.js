import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';
import bcrypt from 'bcrypt';

// GET a single user by ID
export async function GET(request, { params }) {
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

    // Authorization: ADMIN can get any user, FACULTY can get STUDENTs
    if (loggedInUser.role === 'ADMIN' || (loggedInUser.role === 'FACULTY' && user.role === 'STUDENT')) {
      return NextResponse.json(user);
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update a user
export async function PUT(request, { params }) {
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

    // Authorization: ADMIN can update any user, FACULTY can update STUDENTs
    if (loggedInUser.role !== 'ADMIN' && !(loggedInUser.role === 'FACULTY' && userToUpdate.role === 'STUDENT')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role, departmentId } = body;

    // Prevent faculty from changing a user's role
    if (loggedInUser.role === 'FACULTY' && role && role !== 'STUDENT') {
        return NextResponse.json({ error: 'Faculty can only manage students' }, { status: 403 });
    }

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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(request, { params }) {
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

    // Authorization: ADMIN can delete any user, FACULTY can delete STUDENTs
    if (loggedInUser.role !== 'ADMIN' && !(loggedInUser.role === 'FACULTY' && userToDelete.role === 'STUDENT')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
