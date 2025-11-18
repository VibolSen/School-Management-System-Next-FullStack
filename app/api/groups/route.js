import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notification";
import { getLoggedInUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET all groups, including their parent course and a count of students
export async function GET() {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userRole = loggedInUser.role;
    const userId = loggedInUser.id;
    console.log("Groups API - User Role:", userRole, "User ID:", userId);

    let whereClause = {};

    // If the user is an ADMIN, fetch all groups without filtering
    if (userRole === "ADMIN" || userRole === "STUDY_OFFICE") {
      // No additional filtering needed for admin
    } else if (userRole === "TEACHER") {
      whereClause.id = { in: loggedInUser.groupIds };
    } else if (loggedInUser && loggedInUser.role === "FACULTY" && loggedInUser.headedFaculties && loggedInUser.headedFaculties.length > 0) {
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
      const courseIds = coursesInDepartments.map(cd => cd.courseId);

      whereClause.courses = {
        some: {
          id: { in: courseIds },
        },
      };
    } else {
      // If not admin or faculty with headed faculties, return forbidden or empty array
      return new NextResponse("Forbidden", { status: 403 });
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

export async function POST(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "STUDY_OFFICE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, courseIds } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }
    if (!courseIds || courseIds.length === 0) {
      return NextResponse.json({ error: "At least one course is required" }, { status: 400 });
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
    console.error("POST Group Error:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "STUDY_OFFICE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get('id');
    const { name, courseIds } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }
    if (!courseIds || courseIds.length === 0) {
      return NextResponse.json({ error: "At least one course is required" }, { status: 400 });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: id },
      data: {
        name,
        courses: {
          set: courseIds.map((id) => ({ id })),
        },
      },
    });

    if (!updatedGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("PUT Group Error:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "STUDY_OFFICE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    await prisma.group.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("DELETE Group Error:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
