"use client";

import React, { useState } from "react";
import Link from "next/link";
import Notification from "@/components/Notification";

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SUBMITTED: "bg-blue-100 text-blue-800",
    GRADED: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function ExamSubmissionView({ initialSubmission }) {
  const [submission, setSubmission] = useState(initialSubmission);
  const [content, setContent] = useState(initialSubmission.content || "");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && submission.status === "PENDING") {
      showMessage("You cannot submit an empty exam.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/exam-submissions/${submission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, status: "SUBMITTED" }), // Ensure status is explicitly set to SUBMITTED
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit.");
      }
      const updatedSubmissionData = await res.json();
      setSubmission(updatedSubmissionData);
      showMessage("Exam submitted successfully!");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const { exam } = submission;

  return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <Notification
              {...notification}
              onClose={() => setNotification({ ...notification, show: false })}
            />
    
            <div className="flex items-center justify-between mb-5">
              <Link href="/student/exams" className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-4 py-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to My Exams
              </Link>
            </div>
    
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    {exam.title}
                  </h1>
                  <p className="text-slate-600 text-base mt-1">
                    Assigned by: {exam.teacher.firstName}{" "}
                    {exam.teacher.lastName}
                  </p>
                </div>
                <StatusBadge status={submission.status} />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Exam Date:{" "}
                {exam.examDate
                  ? new Date(exam.examDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
    
            {/* Exam Description */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">
                Instructions
              </h2>
              <p className="text-slate-700 text-base whitespace-pre-wrap">
                {exam.description || "No instructions were provided."}
              </p>
            </div>
    
            {/* Submission & Grade Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">
                {submission.status === "PENDING"
                  ? "Your Submission"
                  : "My Submission & Grade"}
              </h2>
    
              {submission.status === "PENDING" && (
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-40 p-4 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                    placeholder="Type your response or paste a link to your work here..."
                  ></textarea>
                  <div className="text-right mt-5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {isLoading ? "Submitting..." : "Submit Exam"}
                    </button>
                  </div>
                </form>
              )}
    
              {submission.status !== "PENDING" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      SUBMITTED WORK
                    </h3>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg shadow-inner whitespace-pre-wrap">
                      {submission.content}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Submitted on:{" "}
                      {submission.submittedAt
                        ? new Date(submission.submittedAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  {submission.status === "GRADED" && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 mb-2">
                        GRADE & FEEDBACK
                      </h3>
                      <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                        <p className="text-3xl font-bold text-green-700">
                          {submission.grade} / 100
                        </p>
                        <p className="text-slate-700 mt-2">
                          {submission.feedback || "No feedback provided."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
