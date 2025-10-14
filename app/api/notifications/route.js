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

// GET all notifications for the logged-in user
export async function GET(req) {
  const user = await getUser(req);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id, isRead: false }, // Only fetch unread notifications
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PUT to mark a notification as read
export async function PUT(req) {
  const user = await getUser(req);
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { notificationId } = await req.json();

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
    console.error("PUT Mark Notification as Read Error:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
