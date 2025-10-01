import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        teacherId: loggedInUser.id,
      },
      include: {
        groups: true,
      },
    });

    const groups = courses.flatMap((course) => course.groups);

    console.log("Found courses:", courses);

    console.log("Found groups:", groups);

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching teacher groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
