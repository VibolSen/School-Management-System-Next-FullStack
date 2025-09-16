import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { courses: true }, // Include courses if needed
    });

    // Always return an array
    return new Response(JSON.stringify(students || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch students:", err);
    return new Response(JSON.stringify([]), { // return empty array on error
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
