import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNotification(userId, type, message, link = null) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        link,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
