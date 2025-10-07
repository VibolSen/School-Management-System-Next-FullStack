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

    const body = await request.json();
    const { oldPassword, newPassword, confirmNewPassword } = body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: 'New password and confirmation do not match' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: loggedInUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Incorrect old password' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: loggedInUser.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

