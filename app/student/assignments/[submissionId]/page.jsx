import { PrismaClient } from "@prisma/client";
import SubmissionView from "./SubmissionView";
import Link from "next/link";

const prisma = new PrismaClient();

// Server-side function to fetch the initial submission data
async function getSubmissionData(submissionId) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        include: {
          teacher: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
  return submission;
}

// The main page component for this dynamic route
export default async function SubmissionPage({ params }) {
  const submissionId = params.submissionId;
  const submission = await getSubmissionData(submissionId);

  if (!submission) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Assignment Not Found</h1>
        <p className="text-slate-500">This submission could not be located.</p>
        <Link
          href="/student/assignments"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to My Assignments
        </Link>
      </div>
    );
  }

  // Render the client component and pass the fetched submission data as a prop
  return <SubmissionView initialSubmission={submission} />;
}
