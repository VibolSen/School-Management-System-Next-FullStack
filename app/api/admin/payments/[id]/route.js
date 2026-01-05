import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

// GET a single payment by ID for admin
export async function GET(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            student: true,
          }
        }
      },
    });

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT (update) a payment by ID for admin
export async function PUT(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { amount, paymentDate, paymentMethod, transactionId, notes } = await request.json();

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        paymentMethod,
        transactionId,
        notes,
      },
    });
    
    // After updating the payment, check if the invoice is fully paid
    const invoice = await prisma.invoice.findUnique({
        where: { id: updatedPayment.invoiceId },
        include: { payments: true },
    });

    const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);

    if (totalPaid >= invoice.totalAmount) {
        await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'PAID' },
        });
    } else {
        // If not fully paid, ensure status is not PAID
        await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'SENT' }, // Or whatever status is appropriate
        });
    }


    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a payment by ID for admin
export async function DELETE(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const payment = await prisma.payment.findUnique({ where: {id}});
    if(!payment) {
        return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    await prisma.payment.delete({
      where: { id },
    });

    // After deleting the payment, check if the invoice is still fully paid
    const invoice = await prisma.invoice.findUnique({
        where: { id: payment.invoiceId },
        include: { payments: true },
    });

    if(invoice) {
        const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);

        if (totalPaid < invoice.totalAmount) {
            await prisma.invoice.update({
                where: { id: invoice.id },
                data: { status: 'SENT' }, // Or whatever status is appropriate
            });
        }
    }

    return NextResponse.json({ message: 'Payment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting payment:', error);
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
