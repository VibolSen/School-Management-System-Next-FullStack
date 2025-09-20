import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // Fetch course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: true,
        department: true,
        groups: { include: { students: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const isTeacher = course.teacherId === loggedInUser.id;
    const isAdmin = loggedInUser.role === "ADMIN";
    const isFaculty = loggedInUser.role === "FACULTY";
    if (!isTeacher && !isAdmin && !isFaculty) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Enrolled students
    const enrolledStudents = course.groups.flatMap((g) => g.students || []);
    const enrolledStudentIds = [...new Set(enrolledStudents.map((s) => s.id))];

    // Attendance records
    const courseAttendanceRecords = await prisma.attendance.findMany({
      where: { courseId },
      include: { status: true },
      orderBy: { date: "asc" },
    });

    // Overall attendance rate
    const presentCount = courseAttendanceRecords.filter(
      (r) =>
        r.status && (r.status.name === "Present" || r.status.name === "Late")
    ).length;
    const totalRecords = courseAttendanceRecords.length;
    const overallAttendanceRate =
      totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    // Attendance trend
    const attendanceByDate = {};
    courseAttendanceRecords.forEach((rec) => {
      const dateKey = new Date(rec.date).toISOString().split("T")[0];
      if (!attendanceByDate[dateKey])
        attendanceByDate[dateKey] = { present: 0, total: 0 };
      attendanceByDate[dateKey].total++;
      if (
        rec.status &&
        (rec.status.name === "Present" || rec.status.name === "Late")
      ) {
        attendanceByDate[dateKey].present++;
      }
    });

    const attendanceTrend = Object.entries(attendanceByDate)
      .map(([rawDate, d]) => ({
        rawDate,
        date: new Date(rawDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        "Attendance Rate":
          d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
      }))
      .sort(
        (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
      )
      .slice(-10)
      .map(({ rawDate, ...rest }) => rest);

    // Student attendance details
    const studentAttendance = enrolledStudents.map((student) => {
      const studentRecords = courseAttendanceRecords.filter(
        (rec) => rec.userId === student.id
      );
      const studentPresentCount = studentRecords.filter(
        (r) =>
          r.status && (r.status.name === "Present" || r.status.name === "Late")
      ).length;
      const attendanceRate =
        studentRecords.length > 0
          ? Math.round((studentPresentCount / studentRecords.length) * 100)
          : 0;

      const lastStatus =
        studentRecords
          .slice()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0]?.status?.name || "N/A";

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        attendanceRate,
        lastStatus,
      };
    });

    // Completion rate from Enrollment
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId, studentId: { in: enrolledStudentIds } },
    });

    const completionRate =
      enrolledStudents.length > 0
        ? Math.round(
            (enrollments.filter((e) => e.progress >= 100).length /
              enrolledStudents.length) *
              100
          )
        : 0;

    const analyticsData = {
      course,
      enrolledStudents: enrolledStudents.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
      })),
      overallAttendanceRate,
      attendanceTrend,
      studentAttendance,
      totalRecords,
      presentCount,
      completionRate,
    };

    return NextResponse.json(analyticsData);
  } catch (err) {
    console.error("[API/COURSE-ANALYTICS] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
