"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useParams } from "next/navigation";
import ProfilePageContent from "@/components/ProfilePageContent";
import Link from "next/link";
import FullPageLoading from "@/components/ui/FullPageLoading";
import { ArrowLeft } from "lucide-react";

export default function TeacherStudentProfilePage() {
  const { user: teacher, loading: userLoading } = useUser();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch student data");
          }
          const data = await res.json();
          setStudent(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id]);

  if (isLoading || userLoading) {
    return <FullPageLoading message="Accessing student record..." />;
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-100">
        <p className="font-semibold">Error: {error}</p>
        <Link href="/teacher/students" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Students
        </Link>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center bg-gray-50 text-gray-600 rounded-xl border border-gray-100">
        <p className="font-semibold">Student member not found.</p>
        <Link href="/teacher/students" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Students
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/teacher/students">
        <button className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition shadow-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
      </Link>
      <ProfilePageContent
        user={student}
        isCurrentUser={false}
        onUpdateProfile={async () => {}}
      />
    </div>
  );
}
