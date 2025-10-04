import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // <--- CHANGE THIS LINE
import { Prisma } from "@prisma/client"; // Import Prisma

export async function GET() {
  try {
    const roles = Object.values(Prisma.Role); // Directly access the enum values
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
