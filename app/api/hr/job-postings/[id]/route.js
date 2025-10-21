import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

// GET a single job posting by ID
export async function GET(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'HR') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
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
    console.error('Error fetching job posting:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT (update) a job posting by ID
export async function PUT(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'HR') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
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
    console.error('Error updating job posting:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a job posting by ID
export async function DELETE(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'HR') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await prisma.jobPosting.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Job posting deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
