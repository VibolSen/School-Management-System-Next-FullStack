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

// POST to mark an announcement as read
export async function POST(req, { params }) {
  const user = await getUser(req);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { announcementId } = params;

  try {
    const existingView = await prisma.announcementView.findFirst({
        where: {
            userId: user.id,
            announcementId: announcementId,
        }
    });

    if (existingView) {
        return NextResponse.json({ message: "Already viewed" });
    }

    await prisma.announcementView.create({
      data: {
        user: { connect: { id: user.id } },
        announcement: { connect: { id: announcementId } },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("POST Announcement View Error:", error);
    return NextResponse.json(
      { error: "Failed to mark announcement as read" },
      { status: 500 }
    );
  }
}
