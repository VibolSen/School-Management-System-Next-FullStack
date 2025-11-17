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
    if (userRole === "ADMIN") {
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
