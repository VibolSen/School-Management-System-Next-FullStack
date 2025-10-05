import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
    );
  }

  try {
    const studentProfile = await prisma.user.findUnique({
      where: { id: studentId },
      include: { 
        enrollments: { 
          include: { 
            course: { 
              include: { 
                courseDepartments: { include: { department: true } }, 
                leadBy: true, 
                groups: true 
              } 
            } 
          } 
        }, 
        groups: { 
          include: { 
            students: true 
          } 
        } 
      },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const pendingAssignmentsCount = await prisma.submission.count({
      where: {
        studentId: studentId,
        status: 'PENDING',
      },
    });

    const pendingExamsCount = await prisma.examSubmission.count({
      where: {
        studentId: studentId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      myProfile: studentProfile,
      pendingAssignmentsCount,
      pendingExamsCount,
    });
  } catch (error) {
    console.error("Failed to fetch student dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
