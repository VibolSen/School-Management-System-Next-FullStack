import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { courseId, issueDate, expiryDate, studentIds } = await request.json();

    if (!courseId || !issueDate || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    // 1. Fetch student details to get their names
    // We need to store 'recipient' as a string in the current schema.
    const students = await prisma.user.findMany({
      where: {
        id: { in: studentIds }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    });

    const studentMap = new Map(students.map(s => [s.id, `${s.firstName} ${s.lastName}`]));

    // 2. Prepare data for batch creation
    const certificatesData = studentIds.map(studentId => {
      const recipientName = studentMap.get(studentId) || "Unknown Student";
      return {
        recipient: recipientName,
        courseId: courseId,
        studentId: studentId,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      };
    }).filter(item => item !== null);

    // 3. Transactional Create
    // Prisma createMany is supported for MongoDB
    const result = await prisma.certificate.createMany({
      data: certificatesData
    });

    return NextResponse.json({ 
      success: true, 
      count: result.count,
      message: `Successfully created ${result.count} certificates`
    }, { status: 201 });

  } catch (error) {
    console.error("Error issuing bulk certificates:", error);
    return NextResponse.json({ message: "Failed to issue certificates" }, { status: 500 });
  }
}
