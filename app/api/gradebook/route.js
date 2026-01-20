// app/api/gradebook/route.js
import { NextResponse } from 'next/server';
import { getLoggedInUser } from '../../../lib/auth.js';
import prisma from '../../../lib/prisma.js';

export async function GET(req) {
  const user = await getLoggedInUser();

  if (!user || (!['ADMIN', 'STUDY_OFFICE', 'TEACHER'].includes(user.role))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    let courses = [];
    let assignments = [];
    let exams = [];

    if (user.role === 'ADMIN' || user.role === 'STUDY_OFFICE') {
      // Admin and Study Office can view all courses, assignments, and exams
      courses = await prisma.course.findMany({
        include: {
          groups: {
            include: {
              students: true,
            },
          },
        },
      });
      assignments = await prisma.assignment.findMany({});
      exams = await prisma.exam.findMany({});
    } else if (user.role === 'TEACHER') {
      const teacherId = user.id;
      // Teacher can only view their own courses, assignments, and exams
      courses = await prisma.course.findMany({
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

      const courseIds = courses.map(c => c.id);
      assignments = await prisma.assignment.findMany({
          where: {
              group: {
                  courseIds: {
                      hasSome: courseIds
                  }
              }
          }
      });

      exams = await prisma.exam.findMany({
          where: {
              group: {
                  courseIds: {
                      hasSome: courseIds
                  }
              }
          }
      });
    }

    // Get all submissions for those assignments and exams
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
