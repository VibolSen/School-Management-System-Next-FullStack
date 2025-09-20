
import { PrismaClient } from "@prisma/client";
import EditExamView from "./EditExamView";
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

async function getExamData(examId) {
  return await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      group: true,
    },
  });
}

export default async function EditExamPage({ params }) {
  const { examId } = params;
  const exam = await getExamData(examId);
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return <div className="p-8">Error: Could not authenticate user.</div>;
  }

  if (!exam) {
    return <div className="p-8">Error: Exam not found.</div>;
  }

  return <EditExamView exam={exam} loggedInUser={loggedInUser} />;
}
