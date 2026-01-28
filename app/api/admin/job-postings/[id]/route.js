import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

// GET a single job posting by ID for admin
export async function GET(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        hiringManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!jobPosting) {
      return NextResponse.json({ message: 'Job posting not found' }, { status: 404 });
    }

    return NextResponse.json(jobPosting);
  } catch (error) {
    console.error('Error fetching admin job posting:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT (update) a job posting by ID for admin
export async function PUT(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const {
      title,
      description,
      requirements,
      responsibilities,
      location,
      department,
      salaryRange,
      employmentType,
      applicationDeadline,
      status,
    } = await request.json();

    const updatedJobPosting = await prisma.jobPosting.update({
      where: { id },
      data: {
        title,
        description,
        requirements,
        responsibilities,
        location,
        department,
        salaryRange,
        employmentType,
        applicationDeadline: new Date(applicationDeadline),
        status,
      },
    });

    return NextResponse.json(updatedJobPosting);
  } catch (error) {
    console.error('Error updating admin job posting:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a job posting by ID for admin
export async function DELETE(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.jobPosting.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Job posting deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting admin job posting:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
