"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Notification from "@/components/Notification"; // Assuming you have this component

// Helper component to display a status badge
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SUBMITTED: "bg-blue-100 text-blue-800",
    GRADED: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function MyExamsView({ loggedInUser }) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

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
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center py-8">Loading your exams...</p>
          ) : submissions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              You have no exams yet. Great job!
            </p>
          ) : (
            submissions.map(({ id, status, grade, exam }) => (
              <Link
                key={id}
                href={`/student/exams/${id}`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge status={status} />
                      <p className="font-semibold text-slate-800 text-lg">
                        {exam.title}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      From: {exam.teacher.firstName}{" "}
                      {exam.teacher.lastName} ({exam.group.name})
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-left sm:text-right">
                    {status === "GRADED" ? (
                      <p className="text-lg font-bold text-green-600">
                        {grade} / 100
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400">Not Graded Yet</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      Date:{" "}
                      {exam.examDate
                        ? new Date(exam.examDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
