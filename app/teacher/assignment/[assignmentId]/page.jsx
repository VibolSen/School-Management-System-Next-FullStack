import { PrismaClient } from "@prisma/client";
import GradingView from "./GradingView";
import Link from "next/link";

const prisma = new PrismaClient();

async function getAssignmentData(assignmentId) {
  return await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      group: { select: { name: true } },
      submissions: {
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { student: { firstName: "asc" } },
      },
    },
  });
}

export default async function GradingPage({ params }) {
  const { assignmentId } = params;
  const assignment = await getAssignmentData(assignmentId);

  if (!assignment) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Assignment Not Found</h1>
        <Link
          href="/teacher/assignment"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to Assignments
        </Link>
      </div>
    );
  }

  return <GradingView initialAssignment={assignment} />;
}
