import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function GET(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) {
      console.log("Unauthorized: No logged in user.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let users = [];
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role");
    const roleTypeFilter = searchParams.get("roleType");

    const selectFields = {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      departmentId: true,
      department: loggedInUser.departmentId
        ? { select: { name: true } }
        : false,
    };

    if (
      loggedInUser.role === "ADMIN" ||
      loggedInUser.role === "HR" ||
      loggedInUser.role === "STUDY_OFFICE"
    ) {
      if (roleFilter) {
        users = await prisma.user.findMany({
          where: { role: roleFilter },
          select: selectFields,
        });
      } else if (roleTypeFilter === "nonStudent") {
        users = await prisma.user.findMany({
          where: {
            role: {
              not: "STUDENT",
            },
          },
          select: selectFields,
        });
      } else {
        users = await prisma.user.findMany({
          select: selectFields,
        });
      }
    } else if (loggedInUser.role === "TEACHER") {
      if (loggedInUser.departmentId) {
        users = await prisma.user.findMany({
          where: {
            role: "STUDENT",
            departmentId: loggedInUser.departmentId,
          },
          select: selectFields,
        });
      } else {
        users = [];
      }
    } else if (loggedInUser.role === "STUDENT") {
      users = [
        await prisma.user.findUnique({
          where: { id: loggedInUser.id },
          select: selectFields,
        }),
      ];
    } else {
      console.log(
        `Forbidden: User with role ${loggedInUser.role} attempted to access user data.`
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (
      !loggedInUser ||
      (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "HR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role, departmentId } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        departmentId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required for PUT request" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role, departmentId } = body;

    if (
      loggedInUser.id !== userId &&
      loggedInUser.role !== "ADMIN" &&
      loggedInUser.role !== "HR" &&
      loggedInUser.role !== "STUDY_OFFICE"
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You can only update your own profile or you do not have permission to update other users",
        },
        { status: 403 }
      );
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (departmentId) updateData.departmentId = departmentId;

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (
      loggedInUser.id === userId &&
      loggedInUser.role === "ADMIN" &&
      role &&
      role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "ADMIN users cannot change their own role" },
        { status: 403 }
      );
    }
    if (loggedInUser.role !== "ADMIN" && role === "ADMIN") {
      return NextResponse.json(
        { error: "Only ADMIN can assign ADMIN role" },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        departmentId: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (
      !loggedInUser ||
      (loggedInUser.role !== "ADMIN" &&
        loggedInUser.role !== "HR" &&
        loggedInUser.role !== "STUDY_OFFICE")
    ) {
      return NextResponse.json(
        { error: "Unauthorized or Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required for DELETE request" },
        { status: 400 }
      );
    }

    if (loggedInUser.id === userId && loggedInUser.role === "ADMIN") {
      return NextResponse.json(
        { error: "ADMIN users cannot delete their own account" },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (prisma) => {
      // Delete required relations
      await prisma.assignment.deleteMany({ where: { teacherId: userId } });
      await prisma.exam.deleteMany({ where: { teacherId: userId } });
      await prisma.libraryResource.deleteMany({
        where: { uploadedById: userId },
      });
      await prisma.announcement.deleteMany({ where: { authorId: userId } });
      await prisma.schedule.deleteMany({ where: { creatorId: userId } });
      await prisma.submission.deleteMany({ where: { studentId: userId } });
      await prisma.examSubmission.deleteMany({ where: { studentId: userId } });
      await prisma.enrollment.deleteMany({ where: { studentId: userId } });
      await prisma.attendance.deleteMany({ where: { studentId: userId } });
      await prisma.staffAttendance.deleteMany({ where: { userId } });
      await prisma.notification.deleteMany({ where: { userId } });
      await prisma.point.deleteMany({ where: { userId } });
      await prisma.profile.deleteMany({ where: { userId } });

      // Disassociate nullable relations
      await prisma.course.updateMany({
        where: { leadById: userId },
        data: { leadById: null },
      });
      await prisma.department.updateMany({
        where: { headId: userId },
        data: { headId: null },
      });
      await prisma.faculty.updateMany({
        where: { headId: userId },
        data: { headId: null },
      });
      await prisma.schedule.updateMany({
        where: { assignedToTeacherId: userId },
        data: { assignedToTeacherId: null },
      });
      await prisma.jobPosting.updateMany({
        where: { hiringManagerId: userId },
        data: { hiringManagerId: null },
      });

      // -----------------------------
      // FIXED: Remove user from group.studentIds array
      // -----------------------------
      const groups = await prisma.group.findMany({
        where: { studentIds: { has: userId } },
      });

      await Promise.all(
        groups.map((group) =>
          prisma.group.update({
            where: { id: group.id },
            data: {
              studentIds: {
                set: group.studentIds.filter((id) => id !== userId),
              },
            },
          })
        )
      );

      // Delete user
      await prisma.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  }
}
