import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const facultyId = searchParams.get('facultyId');
  console.log("Faculty ID:", facultyId);

  if (!facultyId) {
    return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        instructorId: facultyId,
      },
      include: {
        groups: true,
      },
    });

    const courseIds = courses.map((course) => course.id);

    const groupIds = courses.flatMap((course) => course.groups.map((group) => group.id));

    const groupMembers = await prisma.groupMember.findMany({
      where: {
        groupId: {
          in: groupIds,
        },
      },
      select: {
        studentId: true,
      },
    });

    const studentIds = [...new Set(groupMembers.map((gm) => gm.studentId))];

    const students = await prisma.user.findMany({
      where: {
        id: {
          in: studentIds,
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
        date: {
          gte: today,
        },
      },
    });

    const totalCourses = courses.length;
    const totalStudents = students.length;

    const presentCount = attendance.filter((att) => att.status === 'PRESENT' || att.status === 'LATE').length;
    const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

    const todaysSchedule = courses.slice(0, 4).map((course, index) => ({
      ...course,
      time: index === 0 ? '09:00 AM - 10:30 AM' : '11:00 AM - 12:30 PM',
    }));

    const courseAttendanceData = courses.map((course) => {
      const courseRecords = attendance.filter((r) => r.courseId === course.id);
      if (courseRecords.length === 0) return { name: course.name, 'Attendance Rate': 0 };

      const presentCount = courseRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const rate = Math.round((presentCount / courseRecords.length) * 100);
      return { name: course.name, 'Attendance Rate': rate };
    });

    return NextResponse.json({
      totalCourses,
      totalStudents,
      todaysAttendanceRate: `${attendanceRate}%`,
      todaysSchedule,
      courseAttendanceData,
    });
  } catch (error) {
    console.error('Failed to fetch faculty dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}