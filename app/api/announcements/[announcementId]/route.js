import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

// Helper function to get user from token
async function getUser(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

// PUT to update an announcement
export async function PUT(req, { params }) {
  const user = await getUser(req);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { announcementId } = await params;
  
  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    // Only the author or an admin can update the announcement
    if (announcement.authorId !== user.id && user.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: announcementId },
      data: { title, content },
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

// DELETE an announcement
export async function DELETE(req, { params }) {
    const user = await getUser(req);
    if (!user) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { announcementId } = await params;

    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: announcementId },
        });

        if (!announcement) {
            return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        }

        // Only the author or an admin can delete the announcement
        if (announcement.authorId !== user.id && user.role !== "ADMIN") {
            return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        await prisma.announcement.delete({
            where: { id: announcementId },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE Announcement Error:", error);
        return NextResponse.json(
            { error: "Failed to delete announcement" },
            { status: 500 }
        );
    }
}
