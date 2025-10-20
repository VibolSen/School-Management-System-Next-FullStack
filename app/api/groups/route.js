// app/api/groups/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notification"; // New import
import { getLoggedInUser } from "@/lib/auth"; // Import getLoggedInUser

const prisma = new PrismaClient();

// GET all groups, including their parent course and a count of students
export async function GET() {
  try {
    const loggedInUser = await getLoggedInUser();
    let whereClause = {};

    // If the user is a FACULTY and heads at least one faculty, filter groups
    if (loggedInUser && loggedInUser.role === "FACULTY" && loggedInUser.headedFaculties && loggedInUser.headedFaculties.length > 0) {
      const headedFacultyIds = loggedInUser.headedFaculties.map(faculty => faculty.id);

      // Find all departments belonging to these headed faculties
      const departmentsInHeadedFaculties = await prisma.department.findMany({
        where: { facultyId: { in: headedFacultyIds } },
        select: { id: true },
      });
      const departmentIds = departmentsInHeadedFaculties.map(dept => dept.id);

      // Find all courses associated with these departments
      const coursesInDepartments = await prisma.courseDepartment.findMany({
        where: { departmentId: { in: departmentIds } },
        select: { courseId: true },
      });
      const courseIds = coursesInDepartments.map(cd => cd.courseId);

      // Filter groups that are associated with these courses
      whereClause.courses = {
        some: {
          id: { in: courseIds },
        },
      };
    }

    const groups = await prisma.group.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      // ✅ MODIFIED: Include related course and a count of students
      include: {
        courses: true,
        _count: {
          select: { students: true },
        },
      },
    });
    return NextResponse.json(groups);
  } catch (error) {
    console.error("GET Groups Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// CREATE a new group linked to a course
export async function POST(req) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser || (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "FACULTY")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    // ✅ MODIFIED: Expect 'name' and 'courseIds'
    const { name, courseIds } = await req.json();
    if (!name || !courseIds || courseIds.length === 0) {
      return NextResponse.json(
        { error: "Group name and at least one course ID are required" },
        { status: 400 }
      );
    }

    // Authorization for FACULTY directors (POST)
    if (loggedInUser.role === "FACULTY" && loggedInUser.headedFaculties && loggedInUser.headedFaculties.length > 0) {
      const headedFacultyIds = loggedInUser.headedFaculties.map(faculty => faculty.id);
      const departmentsInHeadedFaculties = await prisma.department.findMany({
        where: { facultyId: { in: headedFacultyIds } },
        select: { id: true },
      });
      const departmentIds = departmentsInHeadedFaculties.map(dept => dept.id);

      const coursesInDepartments = await prisma.courseDepartment.findMany({
        where: { departmentId: { in: departmentIds } },
        select: { courseId: true },
      });
      const allowedCourseIds = coursesInDepartments.map(cd => cd.courseId);

      const allCoursesAllowed = courseIds.every(courseId => allowedCourseIds.includes(courseId));
      if (!allCoursesAllowed) {
        return new NextResponse(JSON.stringify({ error: "Forbidden: Cannot create group with courses outside assigned faculty's departments" }), { status: 403 });
      }
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        courses: {
          connect: courseIds.map((id) => ({ id })),
        },
      },
    });
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A group with this name already exists." },
        { status: 409 }
      );
    }
    console.error("POST Group Error:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser || (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "FACULTY")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { name, courseIds, studentIds } = await req.json(); // Can now accept studentIds

    if (!id) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Authorization for FACULTY directors (PUT)
    if (loggedInUser.role === "FACULTY" && loggedInUser.headedFaculties && loggedInUser.headedFaculties.length > 0) {
      const headedFacultyIds = loggedInUser.headedFaculties.map(faculty => faculty.id);
      const departmentsInHeadedFaculties = await prisma.department.findMany({
        where: { facultyId: { in: headedFacultyIds } },
        select: { id: true },
      });
      const departmentIds = departmentsInHeadedFaculties.map(dept => dept.id);

      const coursesInDepartments = await prisma.courseDepartment.findMany({
        where: { departmentId: { in: departmentIds } },
        select: { courseId: true },
      });
      const allowedCourseIds = coursesInDepartments.map(cd => cd.courseId);

      // Check if the group being updated belongs to an allowed course
      const existingGroup = await prisma.group.findUnique({
        where: { id },
        include: { courses: { select: { id: true } } },
      });
      if (!existingGroup) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }
      const existingCourseIds = existingGroup.courses.map(course => course.id);

      const allExistingCoursesAllowed = existingCourseIds.every(courseId => allowedCourseIds.includes(courseId));
      if (!allExistingCoursesAllowed) {
        return new NextResponse(JSON.stringify({ error: "Forbidden: Cannot update group not in assigned faculty's courses" }), { status: 403 });
      }

      // Check if new courseIds are all allowed
      const allNewCoursesAllowed = courseIds.every(courseId => allowedCourseIds.includes(courseId));
      if (!allNewCoursesAllowed) {
        return new NextResponse(JSON.stringify({ error: "Forbidden: Cannot assign group to courses outside assigned faculty's departments" }), { status: 403 });
      }
    }

    // Fetch current group data to find newly added students
    const currentGroup = await prisma.group.findUnique({
      where: { id },
      select: { studentIds: true, name: true },
    });

    if (!currentGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const oldStudentIds = new Set(currentGroup.studentIds.map(String)); // Ensure string comparison
    const newStudentIds = new Set(studentIds.map(String));

    const dataToUpdate = {};

    // Update basic details if provided
    if (name) dataToUpdate.name = name;
    if (Array.isArray(courseIds)) {
      dataToUpdate.courses = {
        set: courseIds.map((id) => ({ id })),
      };
    }

    // If an array of studentIds is provided, update the relationship.
    if (Array.isArray(studentIds)) {
      dataToUpdate.students = {
        set: studentIds.map((studentId) => ({ id: studentId })),
      };
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: dataToUpdate,
    });

    // Identify newly added students and send notifications
    const addedStudents = studentIds.filter(
      (studentId) => !oldStudentIds.has(String(studentId))
    );

    if (addedStudents.length > 0) {
      await createNotification(
        ["STUDENT"], // Target only students
        "GROUP_ADDED",
        `You have been added to the group "${updatedGroup.name}".`,
        `/student/groups` // Link to student's group page
      );
    }

    return NextResponse.json(updatedGroup);
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A group with this name already exists." },
        { status: 409 }
      );
    }
    console.error("PUT Group Error:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

// DELETE a group, with a safety check for students
export async function DELETE(req) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser || (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "FACULTY")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );

    // Authorization for FACULTY directors (DELETE)
    if (loggedInUser.role === "FACULTY" && loggedInUser.headedFaculties && loggedInUser.headedFaculties.length > 0) {
      const headedFacultyIds = loggedInUser.headedFaculties.map(faculty => faculty.id);
      const departmentsInHeadedFaculties = await prisma.department.findMany({
        where: { facultyId: { in: headedFacultyIds } },
        select: { id: true },
      });
      const departmentIds = departmentsInHeadedFaculties.map(dept => dept.id);

      const coursesInDepartments = await prisma.courseDepartment.findMany({
        where: { departmentId: { in: departmentIds } },
        select: { courseId: true },
      });
      const allowedCourseIds = coursesInDepartments.map(cd => cd.courseId);

      const groupCourses = await prisma.group.findUnique({
        where: { id },
        include: { courses: { select: { id: true } } },
      });
      if (!groupCourses) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }
      const existingCourseIds = groupCourses.courses.map(course => course.id);

      const allExistingCoursesAllowed = existingCourseIds.every(courseId => allowedCourseIds.includes(courseId));
      if (!allExistingCoursesAllowed) {
        return new NextResponse(JSON.stringify({ error: "Forbidden: Cannot delete group not in assigned faculty's courses" }), { status: 403 });
      }
    }

    // ✅ ADDED: Safety check to prevent deleting a group that has students
    const studentCount = await prisma.user.count({
      where: { groupIds: { has: id } },
    });
    if (studentCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete group because it has ${studentCount} student(s) assigned.`,
        },
        { status: 409 } // Conflict
      );
    }

    await prisma.group.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Group Error:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
