import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";

// GET all invoices for admin
export async function GET(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new invoice by admin
export async function POST(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { studentId, issueDate, dueDate, items } = await request.json();

    if (!studentId || !issueDate || !dueDate || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields or items cannot be empty." },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);

    const newInvoice = await prisma.invoice.create({
      data: {
        studentId,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        totalAmount,
        status: 'SENT',
        items: {
          create: items.map(item => ({
            feeId: item.feeId,
            description: item.description,
            amount: item.amount,
          })),
        },
      },
      include: {
        items: true,
        student: true,
      }
    });


    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
