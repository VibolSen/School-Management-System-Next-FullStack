import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a single open job posting by ID for public view
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id, status: 'OPEN' }, // Only fetch if status is OPEN
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        responsibilities: true,
        location: true,
        department: true,
        salaryRange: true,
        employmentType: true,
        applicationDeadline: true,
        postedDate: true,
      },
    });

    if (!jobPosting) {
      return NextResponse.json({ message: 'Job posting not found or not open' }, { status: 404 });
    }

    return NextResponse.json(jobPosting);
  } catch (error) {
    console.error('Error fetching public job posting details:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
