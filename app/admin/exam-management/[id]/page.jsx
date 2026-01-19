import { PrismaClient } from "@prisma/client";
import ExamDetailView from "@/components/exam/ExamDetailView"; // Assuming this is a shared component
import Link from "next/link";
import { getLoggedInUser } from "@/lib/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getExamData(params) {
  const { id } = await params; // Await params here as well

  return await prisma.exam.findUnique({
    where: { id },
    include: {
      group: { select: { name: true } },
      teacher: { select: { id: true, firstName: true, lastName: true } },
      submissions: {
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { student: { firstName: "asc" } },
      },
    },
  });
}

export default async function AdminExamDetailPage({ params }) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser || loggedInUser.role !== "ADMIN") {
    // This should ideally be caught by middleware, but good to have a fallback
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-slate-500">You must be an administrator to view this page.</p>
      </div>
    );
  }

  const exam = await getExamData(params);

  if (!exam) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Exam Not Found</h1>
        <p className="text-slate-500">This exam could not be located.</p>
        <Link
          href="/admin/exam-management"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to Exam Management
        </Link>
      </div>
    );
  }

  return <ExamDetailView initialExam={exam} loggedInUser={loggedInUser} />;
}
