import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get('teacherId');

  if (!teacherId) {
    return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        instructorId: teacherId,
      },
    });

    const courseIds = courses.map((course) => course.id);

    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
      },
    });

    const assignmentIds = assignments.map((assignment) => assignment.id);

    const submissions = await prisma.studentAssignment.findMany({
      where: {
        assignmentId: {
          in: assignmentIds,
        },
      },
      include: {
        status: true,
      },
    });

    const assignmentsToGrade = submissions.filter(
      (s) =>
        s.status.name === 'Submitted' ||
        s.status.name === 'Late'
    ).length;

    const upcomingDueDate = assignments
      .filter((a) => new Date(a.dueDate) >= new Date())
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0];

    const submissionsPerAssignment = assignments
      .map((assignment) => {
        const assignmentSubmissions = submissions.filter(
          (s) => s.assignmentId === assignment.id
        );
        return {
          name:
            assignment.title.length > 15
              ? assignment.title.substring(0, 15) + "..."
              : assignment.title,
          Submissions: assignmentSubmissions.length,
        };
      })
      .slice(0, 5);

    // Mock data for classes today and student questions
    const classesToday = courses.length > 1 ? 2 : courses.length;
    const studentQuestionCount = 3;

    return NextResponse.json({
      classesToday,
      assignmentsToGrade,
      upcomingDueDate,
      studentQuestionCount,
      submissionsPerAssignment,
    });
  } catch (error) {
    console.error('Failed to fetch teacher dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}