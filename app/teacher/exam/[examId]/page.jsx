
import { PrismaClient } from "@prisma/client";
import ExamDetailView from "./ExamDetailView";
import Link from "next/link";

const prisma = new PrismaClient();

async function getExamData(params) {
  const { examId } = params;

  return await prisma.exam.findUnique({
    where: { id: examId },
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

export default async function ExamDetailPage({ params }) {
  const exam = await getExamData(params);

  if (!exam) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Exam Not Found</h1>
        <Link
          href="/teacher/exam"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to Exams
        </Link>
      </div>
    );
  }

  return <ExamDetailView initialExam={exam} />;
}
