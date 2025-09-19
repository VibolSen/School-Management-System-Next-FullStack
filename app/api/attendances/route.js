import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

// GET all attendances or one by ?id=
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const courseId = searchParams.get("courseId");
    const date = searchParams.get("date");

    // Authenticate user
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decoded = payload;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const loggedInUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        ledCourses: true,
        groups: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!loggedInUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let whereClause = {};

    // Admins and HR can see all records
    if (loggedInUser.role === "ADMIN" || loggedInUser.role === "HR") {
      if (id) {
        whereClause = { id };
      } else if (courseId && date) {
        whereClause = { courseId, date: new Date(date) };
      } else if (courseId) {
        whereClause = { courseId };
      } else if (date) {
        whereClause = { date: new Date(date) };
      }
    } else if (loggedInUser.role === "TEACHER" || loggedInUser.role === "FACULTY") {
      const userCourseIds = loggedInUser.ledCourses.map(c => c.id);
      // For faculty, also include courses from their groups
      if (loggedInUser.role === "FACULTY") {
        loggedInUser.groups.forEach(group => {
          if (group.course && !userCourseIds.includes(group.course.id)) {
            userCourseIds.push(group.course.id);
          }
        });
      }

      if (id) {
        // If requesting a specific record, ensure it belongs to one of their courses
        const record = await prisma.attendance.findUnique({
          where: { id },
          select: { courseId: true },
        });
        if (!record || !userCourseIds.includes(record.courseId)) {
          return NextResponse.json({ error: "Unauthorized access to attendance record" }, { status: 403 });
        }
        whereClause = { id };
      } else if (courseId && date) {
        if (!userCourseIds.includes(courseId)) {
          return NextResponse.json({ error: "Unauthorized access to course attendance" }, { status: 403 });
        }
        whereClause = { courseId, date: new Date(date) };
      } else if (courseId) {
        if (!userCourseIds.includes(courseId)) {
          return NextResponse.json({ error: "Unauthorized access to course attendance" }, { status: 403 });
        }
        whereClause = { courseId };
      } else if (date) {
        // If only date is provided, filter by user's courses for that date
        whereClause = { date: new Date(date), courseId: { in: userCourseIds } };
      } else {
        // If no filters, return all attendance for their courses
        whereClause = { courseId: { in: userCourseIds } };
      }
    } else { // STUDENT role
      // Students can only see their own attendance records
      whereClause = { userId: loggedInUser.id };
      if (id) {
        const record = await prisma.attendance.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!record || record.userId !== loggedInUser.id) {
          return NextResponse.json({ error: "Unauthorized access to attendance record" }, { status: 403 });
        }
        whereClause = { id };
      } else if (courseId && date) {
        whereClause = { userId: loggedInUser.id, courseId, date: new Date(date) };
      } else if (courseId) {
        whereClause = { userId: loggedInUser.id, courseId };
      } else if (date) {
        whereClause = { userId: loggedInUser.id, date: new Date(date) };
      }
    }

    // Logic for creating default Absent records for teachers/faculty
    if ((loggedInUser.role === "TEACHER" || loggedInUser.role === "FACULTY") && courseId && date) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          groups: {
            include: {
              students: true,
            },
          },
        },
      });

      if (course) {
        const absentStatus = await prisma.attendanceStatus.findUnique({
          where: { name: "Absent" },
        });

        if (absentStatus) {
          const uniqueStudentsInCourse = new Map();
          course.groups.forEach(group => {
            group.students.forEach(student => {
              uniqueStudentsInCourse.set(student.id, student);
            });
          });

          for (const student of uniqueStudentsInCourse.values()) {
            await prisma.attendance.upsert({
              where: {
                userId_courseId_date: {
                  userId: student.id,
                  courseId: courseId,
                  date: new Date(date),
                },
              },
              update: {},
              create: {
                userId: student.id,
                courseId: courseId,
                statusId: absentStatus.id,
                date: new Date(date),
              },
            });
          }
        }
      }
    }

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        user: true,
        course: true,
        status: true,
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET Attendance Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new attendance
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      courseId,
      statusId,
      date,
      checkIn,
      checkOut,
      staffAttendanceSessionId,
    } = body;

    // Authenticate user
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decoded = payload;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const loggedInUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        ledCourses: true,
        groups: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!loggedInUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Authorization check for teachers/faculty
    if ((loggedInUser.role === "TEACHER" || loggedInUser.role === "FACULTY") && courseId) {
      const userCourseIds = loggedInUser.ledCourses.map(c => c.id);
      if (loggedInUser.role === "FACULTY") {
        loggedInUser.groups.forEach(group => {
          if (group.course && !userCourseIds.includes(group.course.id)) {
            userCourseIds.push(group.course.id);
          }
        });
      }
      if (!userCourseIds.includes(courseId)) {
        return NextResponse.json({ error: "Unauthorized to create attendance for this course" }, { status: 403 });
      }
    }

    if (!userId || !statusId || !date || !checkIn) {
      return NextResponse.json(
        { error: "userId, statusId, date, and checkIn are required" },
        { status: 400 }
      );
    }

    const newRecord = await prisma.attendance.create({
      data: {
        userId,
        courseId: courseId || null,
        statusId,
        date: new Date(date),
        checkIn: new Date(checkIn),
        checkOut: checkOut ? new Date(checkOut) : null,
        staffAttendanceSessionId: staffAttendanceSessionId || null,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("POST Attendance Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT update attendance
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    // Authenticate user
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decoded = payload;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const loggedInUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        ledCourses: true,
        groups: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!loggedInUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!id) {
      return NextResponse.json({ error: "Attendance ID is required" }, { status: 400 });
    }

    // Fetch the existing attendance record to get its courseId
    const existingRecord = await prisma.attendance.findUnique({
      where: { id },
      select: { courseId: true, userId: true }, // Also select userId for student role check
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
    }

    // Authorization check for teachers/faculty
    if (loggedInUser.role === "TEACHER" || loggedInUser.role === "FACULTY") {
      const userCourseIds = loggedInUser.ledCourses.map(c => c.id);
      if (loggedInUser.role === "FACULTY") {
        loggedInUser.groups.forEach(group => {
          if (group.course && !userCourseIds.includes(group.course.id)) {
            userCourseIds.push(group.course.id);
          }
        });
      }

      if (!existingRecord.courseId || !userCourseIds.includes(existingRecord.courseId)) {
        return NextResponse.json({ error: "Unauthorized to update attendance for this course" }, { status: 403 });
      }
    } else if (loggedInUser.role === "STUDENT") {
      // Students can only update their own attendance (e.g., check-out)
      if (existingRecord.userId !== loggedInUser.id) {
        return NextResponse.json({ error: "Unauthorized to update this attendance record" }, { status: 403 });
      }
    }

    // Convert date strings to Date objects
    const parsedData = { ...updateData };
    if (parsedData.date) parsedData.date = new Date(parsedData.date);
    if (parsedData.checkIn) parsedData.checkIn = new Date(parsedData.checkIn);
    if (parsedData.checkOut) parsedData.checkOut = new Date(parsedData.checkOut);

    const updatedRecord = await prisma.attendance.update({
      where: { id },
      data: parsedData,
    });

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error("PUT Attendance Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE attendance
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Attendance ID is required" }),
        { status: 400 }
      );
    }

    await prisma.attendance.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Attendance Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
