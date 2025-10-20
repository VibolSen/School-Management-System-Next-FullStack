import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth'; // Import getLoggedInUser

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const faculty = await prisma.faculty.findUnique({
        where: { id },
        include: { departments: true, head: { select: { id: true, firstName: true, lastName: true, email: true } } },
      });
      if (!faculty) {
        return NextResponse.json({ message: 'Faculty not found' }, { status: 404 });
      }
      return NextResponse.json(faculty);
    } else {
      const faculties = await prisma.faculty.findMany({
        include: { departments: true, head: { select: { id: true, firstName: true, lastName: true, email: true } } },
      });
      return NextResponse.json(faculties);
    }
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json({ message: 'Error fetching faculty', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    const newFaculty = await prisma.faculty.create({
      data: { name },
    });
    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    console.error('Error creating faculty:', error);
    return NextResponse.json({ message: 'Error creating faculty', error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser || loggedInUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { name, headId } = await request.json(); // Receive headId

    if (!id) {
      return NextResponse.json({ message: 'Faculty ID is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    // Validate headId if provided
    if (headId) {
      const headUser = await prisma.user.findUnique({
        where: { id: headId },
      });

      if (!headUser) {
        return NextResponse.json({ error: "Director user not found" }, { status: 400 });
      }
      if (headUser.role !== "FACULTY") {
        return NextResponse.json({ error: "Assigned director must have FACULTY role" }, { status: 400 });
      }
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { id },
      data: {
        name,
        head: headId ? { connect: { id: headId } } : { disconnect: true }, // Update headId
      },
    });
    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error('Error updating faculty:', error);
    return NextResponse.json({ message: 'Error updating faculty', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Faculty ID is required' }, { status: 400 });
    }

    await prisma.faculty.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Faculty deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return NextResponse.json({ message: 'Error deleting faculty', error: error.message }, { status: 500 });
  }
}
