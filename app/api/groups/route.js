import { NextResponse } from "next/server";
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
    } else {
      // If not admin or teacher, return forbidden or empty array
      return new NextResponse("Forbidden", { status: 403 });
    }

    const groups = await prisma.group.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      include: {
        courses: true,
        students: true, // Include the actual student objects
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
    const body = await req.json();
    const { name, courseIds, studentIds } = body;

    if (!id) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    let updatedGroup;

    if (studentIds !== undefined) {
      // Logic for connecting/disconnecting students
      const existingGroup = await prisma.group.findUnique({
        where: { id },
        include: { students: true },
      });

      if (!existingGroup) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }

      // Disconnect students who are no longer in studentIds
      const studentsToDisconnect = existingGroup.students.filter(
        (student) => !studentIds.includes(student.id)
      );
      if (studentsToDisconnect.length > 0) {
        await prisma.group.update({
          where: { id },
          data: {
            students: {
              disconnect: studentsToDisconnect.map(student => ({ id: student.id })),
            },
          },
        });
      }
      

      // Connect students who are in studentIds but not in existingGroup
      const existingStudentIds = new Set(existingGroup.students.map(s => s.id));
      const studentsToConnect = studentIds.filter(
        (studentId) => !existingStudentIds.has(studentId)
      );
      
      if (studentsToConnect.length > 0) {
        updatedGroup = await prisma.group.update({
          where: { id },
          data: {
            students: {
              connect: studentsToConnect.map((studentId) => ({ id: studentId })),
            },
          },
          include: { students: true, courses: true },
        });
      } else {
        // If no students to connect, just fetch the group
        updatedGroup = await prisma.group.findUnique({
          where: { id },
          include: { students: true, courses: true },
        });
      }


    } else {
      // Existing logic for updating group details (name, courseIds)
      if (!name) {
        return NextResponse.json({ error: "Group name is required" }, { status: 400 });
      }
      if (!courseIds || courseIds.length === 0) {
        return NextResponse.json({ error: "At least one course is required" }, { status: 400 });
      }

      updatedGroup = await prisma.group.update({
        where: { id: id },
        data: {
          name,
          courses: {
            set: courseIds.map((courseId) => ({ id: courseId })),
          },
        },
        include: { students: true, courses: true }, // Include for consistent return
      });
    }

    if (!updatedGroup) {
      // This case should ideally not be hit if a group is found for update,
      // but good for explicit handling.
      return NextResponse.json({ error: "Group not found after update" }, { status: 404 });
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
