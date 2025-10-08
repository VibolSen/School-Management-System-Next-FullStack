import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function GET(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let users = [];
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const roleTypeFilter = searchParams.get('roleType');

    const selectFields = {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      departmentId: true,
      department: { select: { name: true } },
    };

    if (loggedInUser.role === 'ADMIN' || loggedInUser.role === 'FACULTY' || loggedInUser.role === 'HR') {
      if (roleFilter) {
        users = await prisma.user.findMany({
          where: { role: roleFilter },
          select: selectFields,
        });
      } else if (roleTypeFilter === 'nonStudent') {
        users = await prisma.user.findMany({
          where: {
            role: {
              not: 'STUDENT',
            },
          },
          select: selectFields,
        });
      } else {
        users = await prisma.user.findMany({
          select: selectFields,
        });
      }
    } else if (loggedInUser.role === 'TEACHER') {
      // For teacher, return students in their department
      if (loggedInUser.departmentId) {
        users = await prisma.user.findMany({
          where: {
            role: 'STUDENT',
            departmentId: loggedInUser.departmentId,
          },
          select: selectFields,
        });
      } else {
        // If teacher has no department, they see no students
        users = [];
      }
    } else if (loggedInUser.role === 'STUDENT') {
      // A student can only see their own data
      users = [await prisma.user.findUnique({
        where: { id: loggedInUser.id },
        select: selectFields,
      })];
    } else {
      // Other roles might not be authorized to view users
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser || (loggedInUser.role !== 'ADMIN' && loggedInUser.role !== 'FACULTY')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role, departmentId } = body;

    if (loggedInUser.role === 'FACULTY' && role !== 'STUDENT') {
      return NextResponse.json({ error: 'Faculty can only create students' }, { status: 403 });
    }

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        departmentId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required for PUT request' }, { status: 400 });
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role, departmentId } = body;

    // Check permissions for updating other users
    if (loggedInUser.id !== userId && loggedInUser.role !== 'ADMIN' && loggedInUser.role !== 'HR') {
      return NextResponse.json({ error: 'Forbidden: You can only update your own profile or you do not have permission to update other users' }, { status: 403 });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (departmentId) updateData.departmentId = departmentId;

    // Handle password update separately if provided
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Prevent ADMIN from changing their own role to something else or changing other ADMINs roles
    if (loggedInUser.id === userId && loggedInUser.role === 'ADMIN' && role && role !== 'ADMIN') {
      return NextResponse.json({ error: 'ADMIN users cannot change their own role' }, { status: 403 });
    }
    if (loggedInUser.role !== 'ADMIN' && role === 'ADMIN') {
      return NextResponse.json({ error: 'Only ADMIN can assign ADMIN role' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser || (loggedInUser.role !== 'ADMIN' && loggedInUser.role !== 'HR')) {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required for DELETE request' }, { status: 400 });
    }

    // Prevent ADMIN from deleting themselves
    if (loggedInUser.id === userId && loggedInUser.role === 'ADMIN') {
      return NextResponse.json({ error: 'ADMIN users cannot delete their own account' }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


