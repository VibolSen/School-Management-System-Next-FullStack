"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";
import ExamCard from "@/components/exam/ExamCard";
import { FileText } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function MyExamsView({ loggedInUser }) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const router = useRouter();

  const studentId = loggedInUser?.id;

  const showMessage = useCallback((message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  }, []);

  const fetchExams = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/student/my-exams?studentId=${studentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch your exams.");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      showMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [studentId, showMessage]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Notification
          {...notification}
          onClose={() => setNotification({ ...notification, show: false })}
        />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Exams
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              View your pending and graded exams.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Pending & Graded Exams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full flex flex-col justify-center items-center py-8">
                <LoadingSpinner size="lg" color="blue" className="mb-3" />
                <p className="text-lg font-medium text-slate-700">Loading your exams...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                <FileText className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                <p className="font-bold text-2xl text-slate-700">No Exams Found</p>
                <p className="text-slate-600 mt-2">
                  You have no exams yet. Great job!
                </p>
              </div>
            ) : (
              submissions.map(({ id, status, grade, exam }) => (
                <ExamCard
                  key={id}
                  exam={exam}
                  status={status}
                  grade={grade} // Pass grade to ExamCard
                  onNavigate={() => router.push(`/student/exams/${id}`)}
                  showActions={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
