import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import ExamManagement from "@/components/exam/ExamManagement"; // Changed from ExamsView

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

async function getLoggedInUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) {
    console.log("getLoggedInUser (teacher page): No token found."); // DEBUG
    return null;
  }
  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    console.log("getLoggedInUser (teacher page): JWT Payload:", payload); // DEBUG
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    console.log("getLoggedInUser (teacher page): Prisma User Object:", user); // DEBUG
    return user;
  } catch (error) {
    console.error("getLoggedInUser (teacher page): Error verifying token or fetching user:", error); // DEBUG
    return null;
  }
}

export default async function ExamsPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return <div className="p-8">Error: Could not authenticate user.</div>;
  }

  // Render the shared ExamManagement component and pass the user data to it as a prop
  return <ExamManagement loggedInUser={loggedInUser} />;
}