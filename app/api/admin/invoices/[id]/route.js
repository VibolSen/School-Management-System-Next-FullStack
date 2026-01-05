import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

// GET a single invoice by ID for admin
export async function GET(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        student: {
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
          }
        },
        payments: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT (update) an invoice by ID for admin
export async function PUT(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { message: "Missing required fields: status" },
        { status: 400 }
      );
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE an invoice by ID for admin
export async function DELETE(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // First, delete related payments and invoice items, then delete the invoice.
    // This is a cascading delete.
    await prisma.$transaction([
        prisma.payment.deleteMany({ where: { invoiceId: id } }),
        prisma.invoiceItem.deleteMany({ where: { invoiceId: id } }),
        prisma.invoice.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: 'Invoice deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
