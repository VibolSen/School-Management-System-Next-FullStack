import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all open job postings for public view
export async function GET(request) {
  try {
    const jobPostings = await prisma.jobPosting.findMany({
      where: {
        status: 'OPEN',
      },
      orderBy: {
        postedDate: 'desc',
      },
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
    return NextResponse.json(jobPostings);
  } catch (error) {
    console.error('Error fetching public job postings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
