import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // In a real application, you would get the user ID from the authenticated session.
    // For now, let's assume a user ID is passed as a query parameter for testing.
    // const userId = req.query.userId; 
    // Or from a token in the headers
    // const userId = req.headers.get('x-user-id');

    // For demonstration, let's fetch a hardcoded user's profile or
    // assume the user ID is available from a session/auth context.
    // This part needs to be integrated with your actual authentication system.
    
    // Placeholder for authenticated user ID
    const userId = 'YOUR_AUTHENTICATED_USER_ID'; // Replace with actual authenticated user ID

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.profile.findUnique({
      where: { userId: userId },
      include: { user: true }, // Include user details along with the profile
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
