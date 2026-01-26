import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedInUser.role !== "ADMIN" && loggedInUser.role !== "STUDY_OFFICE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const faculties = await prisma.faculty.findMany({
      orderBy: { name: "asc" },
      include: {
        head: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        departments: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(faculties);
  } catch (error) {
    console.error("GET Faculties Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculties" },
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
    const { headId } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Faculty ID is required" }, { status: 400 });
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { id: id },
      data: { headId: headId },
    });

    if (!updatedFaculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error("PUT Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to update faculty" },
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

    const { name, description, headId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Faculty name is required" }, { status: 400 });
    }

    const newFaculty = await prisma.faculty.create({
      data: {
        name,
        description,
        headId,
      },
    });

    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    console.error("POST Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to create faculty" },
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
      return NextResponse.json({ error: "Faculty ID is required" }, { status: 400 });
    }

    const deletedFaculty = await prisma.faculty.delete({
      where: { id: id },
    });

    if (!deletedFaculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("DELETE Faculty Error:", error);
    return NextResponse.json(
      { error: "Failed to delete faculty" },
      { status: 500 }
    );
  }
}