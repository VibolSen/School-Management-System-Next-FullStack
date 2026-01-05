import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Await params to resolve it before destructuring
    const resolvedParams = await params;
    const { id } = resolvedParams; // This 'id' is the invoice ID

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: id,
        studentId: session.id, // Ensure the invoice belongs to the logged-in student
      },
      include: {
        student: { // Include student details if needed, but for student view, might just need their own ID
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            fee: true,
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found or does not belong to student' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching single student invoice:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}