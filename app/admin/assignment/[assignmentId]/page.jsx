import prisma from "@/lib/prisma";
import GradingView from "./GradingView"; // This path will need adjustment
import Link from "next/link";



// ✅ FIX #1: The function now accepts the whole `params` object
async function getAssignmentData(params) {
  // Destructuring happens safely inside the function
  const assignmentId = params.assignmentId;

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
  // ✅ FIX #2: Call the async data fetching function first, passing `params` directly.
  const assignment = await getAssignmentData(params);

  if (!assignment) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Assignment Not Found</h1>
        <Link
          href="/admin/assignment-management" // Changed for admin
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to Assignment Management
        </Link>
      </div>
    );
  }

  // Pass the fully loaded data to the client component
  return <GradingView initialAssignment={assignment} />;
}
