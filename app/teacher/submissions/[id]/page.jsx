import { notFound } from "next/navigation";
import TeacherSubmissionDetailView from "@/components/assignment/TeacherSubmissionDetailView";

export default async function TeacherSubmissionDetailPage({ params }) {
  const { id } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/teacher/submissions/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch submission details");
  }

  const submission = await res.json();

  return <TeacherSubmissionDetailView submission={submission} />;
}
