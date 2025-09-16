import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";

// We will create/place the TeacherDashboard component in the same folder
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

// Server-side function to get the currently logged-in user
async function getLoggedInUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) return null;

  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, firstName: true, lastName: true },
    });
    return user;
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return null;
  }
}

// The main page for the route /teacher/dashboard
export default async function TeacherDashboardPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return <div className="p-8">Error: Could not authenticate user.</div>;
  }

  // Pass the user data as a prop to our client component
  return <TeacherDashboard loggedInUser={loggedInUser} />;
}
