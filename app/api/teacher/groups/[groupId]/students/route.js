import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { groupId } = await params; // ✅ FIXED

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { students: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group.students);
  } catch (error) {
    console.error("Error fetching group students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
