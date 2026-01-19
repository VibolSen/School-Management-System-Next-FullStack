import { PrismaClient } from "@prisma/client";
import ExamSubmissionView from "./ExamSubmissionView";
import Link from "next/link";

const prisma = new PrismaClient();

// ✅ FIX #1: Modify this function to accept the entire params object
async function getExamSubmissionData(params) {
  // Destructure inside the function
  const { examSubmissionId } = await params; // Await params
  const examSubmission = await prisma.examSubmission.findUnique({
    where: { id: examSubmissionId },
    include: {
      exam: {
        include: {
          teacher: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
  return examSubmission;
}

// The main page component for this dynamic route
export default async function ExamSubmissionPage({ params }) {
  // ✅ FIX #2: Call the data fetching function *before* trying to use any params.
  // Pass the whole params object directly.
  const examSubmission = await getExamSubmissionData(params);

  if (!examSubmission) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Exam Not Found</h1>
        <p className="text-slate-500">This submission could not be located.</p>
        <Link
          href="/student/exams"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to My Exams
        </Link>
      </div>
    );
  }

  return <ExamSubmissionView initialSubmission={examSubmission} />;
}
