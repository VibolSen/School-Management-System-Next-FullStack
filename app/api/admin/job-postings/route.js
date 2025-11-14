import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";

// GET all job postings for admin
export async function GET(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jobPostings = await prisma.jobPosting.findMany({
      orderBy: {
        postedDate: "desc",
      },
      include: {
        hiringManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(jobPostings);
  } catch (error) {
    console.error("Error fetching admin job postings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new job posting by admin
export async function POST(request) {
  try {
    const session = await getLoggedInUser();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      requirements,
      responsibilities,
      location,
      department,
      salaryRange,
      employmentType,
      applicationDeadline,
    } = await request.json();

    if (
      !title ||
      !description ||
      !requirements ||
      !responsibilities ||
      !location ||
      !employmentType ||
      !applicationDeadline
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newJobPosting = await prisma.jobPosting.create({
      data: {
        title,
        description,
        requirements,
        responsibilities,
        location,
        department,
        salaryRange,
        employmentType,
        applicationDeadline: new Date(applicationDeadline),
        hiringManagerId: session.id, // Admin user creating the job posting
      },
    });

    return NextResponse.json(newJobPosting, { status: 201 });
  } catch (error) {
    console.error("Error creating admin job posting:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
