
import { PrismaClient } from "@prisma/client";
import EditAssignmentView from "./EditAssignmentView";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

async function getLoggedInUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) return null;
  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    return user;
  } catch (error) {
    return null;
  }
}

async function getAssignmentData(assignmentId) {
  return await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      group: true,
    },
  });
}

export default async function EditAssignmentPage({ params }) {
  const { assignmentId } = params;
  const assignment = await getAssignmentData(assignmentId);
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return <div className="p-8">Error: Could not authenticate user.</div>;
  }

  if (!assignment) {
    return <div className="p-8">Error: Assignment not found.</div>;
  }

  return <EditAssignmentView assignment={assignment} loggedInUser={loggedInUser} />;
}
