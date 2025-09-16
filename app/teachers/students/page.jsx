import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import MyStudentsView from "@/components/MyStudentsView"; // Import our new client component

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
    // Select only the necessary fields
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, firstName: true, lastName: true },
    });
    return user;
  } catch (error) {
    console.error("Authentication Error:", error);
    return null;
  }
}

// The main page for the /teacher/my-students route
export default async function MyStudentsPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return (
      <div className="p-8">
        Error: Could not authenticate user. Please log in again.
      </div>
    );
  }

  // Render the client component and pass the user data to it as a prop
  return <MyStudentsView loggedInUser={loggedInUser} />;
}
