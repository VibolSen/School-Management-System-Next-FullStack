import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("GET Announcements Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        authorId: loggedInUser.id,
      },
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("POST Announcement Error:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { title, content } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "ID, title, and content are required" },
        { status: 400 }
      );
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error("PUT Announcement Error:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 });
    }

    await prisma.announcement.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Announcement Error:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
