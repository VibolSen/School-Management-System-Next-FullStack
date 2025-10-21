import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth"; // must return { id, role, ... }

// GET all job postings
export async function GET(request) {
  try {
    const session = await getLoggedInUser(); // ✅ define session properly

    if (!session || session.role !== "HR") {
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
    console.error("Error fetching job postings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new job posting
export async function POST(request) {
  try {
    const session = await getLoggedInUser(); // ✅ consistent call

    if (!session || session.role !== "HR") {
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

    // ✅ Validate required fields
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

    // ✅ Create new job posting
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
        hiringManagerId: session.id, // assumes session.id is the logged-in HR user's ID
      },
    });

    return NextResponse.json(newJobPosting, { status: 201 });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
