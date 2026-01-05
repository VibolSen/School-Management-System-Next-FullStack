import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth'; // Assuming this function exists

export async function GET(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.id;

    const invoices = await prisma.invoice.findMany({
      where: { studentId: studentId },
      include: {
        items: {
          include: {
            fee: true,
          },
        },
        payments: true,
      },
      orderBy: {
        issueDate: 'desc', // Order by most recent invoices first
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching student invoices:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}