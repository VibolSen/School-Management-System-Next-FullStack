"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification"; // Assuming you have this component
import ExamCard from "@/components/exam/ExamCard";

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
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">My Exams</h1>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Pending & Graded Exams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <p className="text-center py-8">Loading your exams...</p>
          ) : submissions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              You have no exams yet. Great job!
            </p>
          ) : (
            submissions.map(({ id, status, grade, exam }) => (
              <ExamCard
                key={id}
                exam={exam}
                status={status}
                onNavigate={() => router.push(`/student/exams/${id}`)}
                showActions={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
