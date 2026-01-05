import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";

// GET all payments for admin
export async function GET(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new payment by admin
export async function POST(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId, amount, paymentDate, paymentMethod, transactionId, notes } = await request.json();

    if (!invoiceId || !amount || !paymentDate || !paymentMethod) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const newPayment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: parseFloat(amount),
        paymentDate: new Date(paymentDate),
        paymentMethod,
        transactionId,
        notes,
      },
    });

    // After creating the payment, check if the invoice is fully paid
    const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true },
    });

    const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);

    if (totalPaid >= invoice.totalAmount) {
        await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PAID' },
        });
    }

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
