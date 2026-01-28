import { NextResponse } from "next/server";
import { cleanupOldNotifications } from "@/lib/cleanupNotifications";
import { getLoggedInUser } from "@/lib/auth";

/**
 * POST endpoint to trigger notification cleanup
 * Deletes all notifications older than 7 days
 * Can be called manually by admins or automatically by cron jobs
 */
export async function POST(request) {
  try {
    // Optional: Check if request is from admin or has valid API key
    const loggedInUser = await getLoggedInUser();
    
    // Allow access if:
    // 1. User is an admin, OR
    // 2. Request has valid API key in header (for cron jobs)
    const apiKey = request.headers.get("x-api-key");
    const isValidApiKey = apiKey === process.env.CLEANUP_API_KEY;
    
    if (!isValidApiKey && (!loggedInUser || loggedInUser.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access or valid API key required." },
        { status: 403 }
      );
    }

    // Run cleanup
    const result = await cleanupOldNotifications();

    if (result.success) {
      return NextResponse.json(
        {
          message: "Notification cleanup completed successfully",
          deletedCount: result.deletedCount,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Cleanup failed",
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cleanup API Error:", error);
    return NextResponse.json(
      { error: "Failed to run cleanup", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check cleanup status or get info
 */
export async function GET(request) {
  try {
    const loggedInUser = await getLoggedInUser();
    
    if (!loggedInUser || loggedInUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    // Calculate how many notifications would be deleted
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const count = await prisma.notification.count({
      where: {
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    return NextResponse.json({
      message: "Cleanup info",
      notificationsOlderThan7Days: count,
      cutoffDate: sevenDaysAgo.toISOString(),
    });
  } catch (error) {
    console.error("Cleanup Info Error:", error);
    return NextResponse.json(
      { error: "Failed to get cleanup info", details: error.message },
      { status: 500 }
    );
  }
}
