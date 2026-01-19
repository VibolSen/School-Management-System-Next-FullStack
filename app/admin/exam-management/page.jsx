import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import ExamManagement from "@/components/exam/ExamManagement";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

async function getLoggedInUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) {
    console.log("getLoggedInUser (admin page): No token found."); // DEBUG
    return null;
  }
  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    console.log("getLoggedInUser (admin page): JWT Payload:", payload); // DEBUG
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    console.log("getLoggedInUser (admin page): Prisma User Object:", user); // DEBUG
    return user;
  } catch (error) {
    console.error("getLoggedInUser (admin page): Error verifying token or fetching user:", error); // DEBUG
    return null;
  }
}

const AssignmentManagementPage = () => {
  // This component is now ExamManagement, so the name is misleading.
  // It should be ExamManagementPage. But for now, we leave it as is to focus on the bug.
  return <ExamManagement />;
};

export default async function ExamManagementPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return <div className="p-8">Error: Could not authenticate user.</div>;
  }

  return <ExamManagement loggedInUser={loggedInUser} />;
}
