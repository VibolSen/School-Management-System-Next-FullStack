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

// PUT to mark a specific notification as read
export async function PUT(req, { params }) {
  const user = await getUser(req);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { notificationId } = await params;

  if (!notificationId) {
    return new NextResponse(JSON.stringify({ error: "Notification ID is required" }), { status: 400 });
  }

  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId, userId: user.id },
      data: { isRead: true },
    });

    if (!updatedNotification) {
      return new NextResponse(JSON.stringify({ error: "Notification not found or not authorized" }), { status: 404 });
    }

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("PUT Mark Specific Notification as Read Error:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}