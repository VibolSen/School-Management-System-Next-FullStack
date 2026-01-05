import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";

// GET all fees for admin
export async function GET(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const fees = await prisma.fee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new fee by admin
export async function POST(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description, amount } = await request.json();

    if (!name || !amount) {
      return NextResponse.json(
        { message: "Missing required fields: name and amount" },
        { status: 400 }
      );
    }

    const newFee = await prisma.fee.create({
      data: {
        name,
        description,
        amount: parseFloat(amount),
      },
    });

    return NextResponse.json(newFee, { status: 201 });
  } catch (error) {
    console.error("Error creating fee:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json(
        { message: "A fee with this name already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
