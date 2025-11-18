import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth"; // Import getLoggedInUser

const prisma = new PrismaClient();

export const revalidate = 0;

// GET function (no changes)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    const loggedInUser = await getLoggedInUser(); // Use getLoggedInUser

    let whereClause = {};
    if (teacherId) {
      whereClause.leadById = teacherId; // Changed from teacherId to leadById
    }

    // If the user is a FACULTY and heads at least one faculty, filter courses
    if (loggedInUser && loggedInUser.role === "FACULTY" && loggedInUser.headedFaculties && loggedInUser.headedFaculties.length > 0) {
      const headedFacultyIds = loggedInUser.headedFaculties.map(faculty => faculty.id);

      // Find all departments belonging to these headed faculties
      const departmentsInHeadedFaculties = await prisma.department.findMany({
        where: { facultyId: { in: headedFacultyIds } },
        select: { id: true },
      });
      const departmentIds = departmentsInHeadedFaculties.map(dept => dept.id);

      // Filter courses that are associated with these departments
      whereClause.courseDepartments = {
        some: {
          departmentId: { in: departmentIds },
        },
      };
    } else if (loggedInUser && loggedInUser.role !== "ADMIN" && loggedInUser.role !== "FACULTY" && loggedInUser.role !== "STUDY_OFFICE") {
      // If the user is not an admin or faculty, they can only see their own courses
      whereClause.leadById = loggedInUser.id;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      include: {
        courseDepartments: {
          include: {
            department: true,
          },
        },
        leadBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: {
          select: { groups: true },
        },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("GET Courses Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST function (with authorization)
export async function POST(req) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { role, id: loggedInUserId } = loggedInUser;

  try {
    const { name, departmentIds, teacherId: requestedTeacherId } = await req.json();
    console.log("--- Creating Course ---", { name, departmentIds, requestedTeacherId });

    if (!name || !departmentIds || departmentIds.length === 0) {
      return NextResponse.json(
        { error: "Course name and department ID are required" },
        { status: 400 }
      );
    }

    let finalTeacherId = requestedTeacherId;

    // Authorization logic for POST
    if (role === "FACULTY") {
      // Faculty can only create courses where they are the lead teacher
      if (requestedTeacherId && requestedTeacherId !== loggedInUserId) {
        return new NextResponse(JSON.stringify({ error: "Faculty can only create courses they lead." }), { status: 403 });
      }
      finalTeacherId = loggedInUserId; // Ensure faculty is assigned as lead
    } else if (role !== "ADMIN" && role !== "STUDY_OFFICE") {
      // Only ADMIN, STUDY_OFFICE, or FACULTY (for themselves) can create courses
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const dataToCreate = {
      name,
    };
    if (finalTeacherId) {
      dataToCreate.leadBy = { connect: { id: finalTeacherId } };
    }
    const newCourse = await prisma.course.create({ data: dataToCreate });

    if (departmentIds && departmentIds.length > 0) {
      await prisma.courseDepartment.createMany({
        data: departmentIds.map((deptId) => ({
          courseId: newCourse.id,
          departmentId: deptId,
        })),
      });
    }

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A course with this name already exists." },
        { status: 409 }
      );
    }
    console.error("POST Course Error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

// UPDATE function (with authorization)
export async function PUT(req) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { role, id: loggedInUserId } = loggedInUser;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { name, departmentIds, teacherId: requestedTeacherId } = await req.json();

    if (!id || !name || !departmentIds) {
      return NextResponse.json(
        { error: "Course ID, name, and department ID are required" },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id },
      select: { leadById: true },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Authorization logic for PUT
    if (role === "FACULTY") {
      // Faculty can only update courses they lead
      if (existingCourse.leadById !== loggedInUserId) {
        return new NextResponse(JSON.stringify({ error: "Faculty can only update courses they lead." }), { status: 403 });
      }
      // Faculty cannot change the lead teacher
      if (requestedTeacherId && requestedTeacherId !== loggedInUserId) {
        return new NextResponse(JSON.stringify({ error: "Faculty cannot change the lead teacher of a course." }), { status: 403 });
      }
    } else if (role !== "ADMIN" && role !== "STUDY_OFFICE") {
      // Only ADMIN, STUDY_OFFICE, or FACULTY (for courses they lead) can update courses
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const dataToUpdate = {
      name,
    };

    // Handle teacherId update (only if not faculty or if faculty is updating to themselves)
    if (requestedTeacherId && (role !== "FACULTY" || requestedTeacherId === loggedInUserId)) {
      dataToUpdate.leadBy = { connect: { id: requestedTeacherId } };
    } else if (requestedTeacherId === null && role !== "FACULTY") { // Allow admin/study_office to disconnect
      dataToUpdate.leadBy = { disconnect: true };
    }


    const updatedCourse = await prisma.course.update({
      where: { id },
      data: dataToUpdate,
      include: {
        courseDepartments: true, // Include existing departments to compare
      },
    });

    // Update CourseDepartment entries efficiently
    const existingDepartmentIds = updatedCourse.courseDepartments.map(
      (cd) => cd.departmentId
    );
    const departmentsToConnect = departmentIds.filter(
      (deptId) => !existingDepartmentIds.includes(deptId)
    );
    const departmentsToDisconnect = existingDepartmentIds.filter(
      (deptId) => !departmentIds.includes(deptId)
    );

    if (departmentsToConnect.length > 0) {
      await prisma.courseDepartment.createMany({
        data: departmentsToConnect.map((deptId) => ({
          courseId: updatedCourse.id,
          departmentId: deptId,
        })),
      });
    }

    if (departmentsToDisconnect.length > 0) {
      await prisma.courseDepartment.deleteMany({
        where: {
          courseId: updatedCourse.id,
          departmentId: { in: departmentsToDisconnect },
        },
      });
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A course with this name already exists." },
        { status: 409 }
      );
    }
    console.error("PUT Course Error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE function (with authorization)
export async function DELETE(req) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { role, id: loggedInUserId } = loggedInUser;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id },
      select: { leadById: true },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Authorization logic for DELETE
    if (role === "FACULTY") {
      // Faculty can only delete courses they lead
      if (existingCourse.leadById !== loggedInUserId) {
        return new NextResponse(JSON.stringify({ error: "Faculty can only delete courses they lead." }), { status: 403 });
      }
    } else if (role !== "ADMIN" && role !== "STUDY_OFFICE") {
      // Only ADMIN, STUDY_OFFICE, or FACULTY (for courses they lead) can delete courses
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    await prisma.courseDepartment.deleteMany({ where: { courseId: id } });
    await prisma.course.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Course Error:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}