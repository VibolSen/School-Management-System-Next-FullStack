import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";

// GET all expenses for admin
export async function GET(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new expense by admin
export async function POST(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { category, description, amount, date } = await request.json();

    if (!category || !amount || !date) {
      return NextResponse.json(
        { message: "Missing required fields: category, amount, and date" },
        { status: 400 }
      );
    }

    const newExpense = await prisma.expense.create({
      data: {
        category,
        description,
        amount: parseFloat(amount),
        date: new Date(date),
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
