import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

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

    if (loggedInUser.role === 'ADMIN') {
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
    } else if (loggedInUser.role === 'FACULTY' || loggedInUser.role === 'TEACHER') {
      // For faculty/teacher, return students in their department
      if (loggedInUser.departmentId) {
        users = await prisma.user.findMany({
          where: {
            role: 'STUDENT',
            departmentId: loggedInUser.departmentId,
          },
          select: selectFields,
        });
      } else {
        // If faculty/teacher has no department, they see no students
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
