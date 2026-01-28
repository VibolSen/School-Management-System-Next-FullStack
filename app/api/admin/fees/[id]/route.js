import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';

// GET a single fee by ID for admin
export async function GET(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const fee = await prisma.fee.findUnique({
      where: { id },
    });

    if (!fee) {
      return NextResponse.json({ message: 'Fee not found' }, { status: 404 });
    }

    return NextResponse.json(fee);
  } catch (error) {
    console.error('Error fetching fee:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT (update) a fee by ID for admin
export async function PUT(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, amount } = await request.json();

    if (!name || !amount) {
      return NextResponse.json(
        { message: "Missing required fields: name and amount" },
        { status: 400 }
      );
    }

    const updatedFee = await prisma.fee.update({
      where: { id },
      data: {
        name,
        description,
        amount: parseFloat(amount),
      },
    });

    return NextResponse.json(updatedFee);
  } catch (error)
 {
    console.error('Error updating fee:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json(
        { message: "A fee with this name already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a fee by ID for admin
export async function DELETE(request, { params }) {
  try {
    const session = await getLoggedInUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.fee.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Fee deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting fee:', error);
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Fee not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
