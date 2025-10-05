// app/api/teacher/gradebook/route.js
import { NextResponse } from 'next/server';
import { getLoggedInUser } from '../../../../lib/auth.js';
import prisma from '../../../../lib/prisma.js';

export async function GET(req) {
  const user = await getLoggedInUser();

  if (!user || user.role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const teacherId = user.id;

    // 1. Find all courses taught by the teacher
    const courses = await prisma.course.findMany({
      where: {
        leadById: teacherId,
      },
      include: {
        groups: {
          include: {
            students: true, // Get all students in each group
          },
        },
      },
    });

    // 2. Get all assignments and exams for the teacher's courses
    const courseIds = courses.map(c => c.id);
    const assignments = await prisma.assignment.findMany({
        where: {
            group: {
                courseIds: {
                    hasSome: courseIds
                }
            }
        }
    });

    const exams = await prisma.exam.findMany({
        where: {
            group: {
                courseIds: {
                    hasSome: courseIds
                }
            }
        }
    });

    // 3. Get all submissions for those assignments and exams
    const assignmentIds = assignments.map(a => a.id);
    const examIds = exams.map(e => e.id);

    const submissions = await prisma.submission.findMany({
      where: { assignmentId: { in: assignmentIds } },
    });

    const examSubmissions = await prisma.examSubmission.findMany({
      where: { examId: { in: examIds } },
    });

    // 4. Structure the data
    const gradebookData = {
      courses,
      assignments,
      exams,
      submissions,
      examSubmissions,
    };

    return NextResponse.json(gradebookData);
  } catch (error) {
    console.error("Get Gradebook Error:", error);
    return NextResponse.json({ error: 'Failed to fetch gradebook data' }, { status: 500 });
  }
}
