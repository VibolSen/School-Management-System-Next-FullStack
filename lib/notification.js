import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create notifications for ALL users with specified roles (for broadcasts/announcements)
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

// Create notifications for SPECIFIC users (for targeted notifications)
export async function createNotificationForUsers(userIds, type, message, link = null, targetRoles = []) {
  try {
    if (!userIds || userIds.length === 0) {
      console.warn("No user IDs provided for notification");
      return;
    }

    const notificationsData = userIds.map((userId) => ({
      userId,
      type,
      message,
      link,
      targetRoles, // Store roles for filtering in the API
    }));

    await prisma.notification.createMany({
      data: notificationsData,
    });
  } catch (error) {
    console.error("Failed to create notification for users:", error);
  }
}
