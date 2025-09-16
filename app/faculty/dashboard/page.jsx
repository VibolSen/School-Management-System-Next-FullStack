import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import FacultyDashboard from "@/components/dashboard/FacultyDashboard"; // Make sure this path is correct

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

// This is an async Server Component that fetches data
async function getLoggedInUser() {
  // ✅ FIX IS HERE: `cookies()` is now awaited
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) return null;

  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to verify token or fetch user:", error);
    return null;
  }
}

export default async function FacultyDashboardPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return (
      <div className="p-8">
        Error: Could not authenticate user. Please log in again.
      </div>
    );
  }

  // Pass the fetched user data as a prop to the client component
  return <FacultyDashboard loggedInUser={loggedInUser} />;
}
