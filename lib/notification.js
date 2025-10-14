import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNotification(targetRoles, type, message, link = null) {
  try {
    const usersToNotify = await prisma.user.findMany({
      where: {
        role: {
          in: targetRoles,
        },
      },
      select: { id: true }, // Only select the ID to minimize data transfer
    });

    const notificationsData = usersToNotify.map((user) => ({
      userId: user.id,
      type,
      message,
      link,
      targetRoles, // Store the target roles with the notification
    }));

    await prisma.notification.createMany({
      data: notificationsData,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
