import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Deletes notifications older than 7 days from the database
 * @returns {Promise<{success: boolean, deletedCount: number, error?: string}>}
 */
export async function cleanupOldNotifications() {
  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log(`Cleaning up notifications older than: ${sevenDaysAgo.toISOString()}`);

    // Delete notifications older than 7 days
    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    console.log(`Successfully deleted ${result.count} old notifications`);

    return {
      success: true,
      deletedCount: result.count,
    };
  } catch (error) {
    console.error("Error cleaning up notifications:", error);
    return {
      success: false,
      deletedCount: 0,
      error: error.message,
    };
  }
}
