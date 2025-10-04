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
    console.log("Fetching groups for user:", loggedInUser);

    const courses = await prisma.course.findMany({
      where: {
        leadById: loggedInUser.id,
      },
      include: {
        groups: true,
      },
    });

    console.log("Found courses for user:", courses);

    const allGroups = courses.flatMap((course) => course.groups);
    console.log("All groups from courses:", allGroups);

    const uniqueGroups = Array.from(new Map(allGroups.map(group => [group.id, group])).values());

    console.log("Unique groups returned:", uniqueGroups);

    return NextResponse.json(uniqueGroups);
  } catch (error) {
    console.error("Error fetching teacher groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
