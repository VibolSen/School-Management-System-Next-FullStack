
"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Notification from "@/components/Notification";

// Helper component for status badges
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-gray-200 text-gray-800",
    SUBMITTED: "bg-blue-200 text-blue-800",
    GRADED: "bg-green-200 text-green-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

// Component for a single row in the submission table
const SubmissionRow = ({ submission, onGrade }) => {
  const [grade, setGrade] = useState(submission.grade ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onGrade(submission.id, grade, feedback);
    setIsSaving(false);
  };

  return (
    <tr className="bg-white border-b hover:bg-slate-50">
      <td className="px-6 py-4 font-medium text-gray-900">{`${submission.student.firstName} ${submission.student.lastName}`}</td>
      <td className="px-6 py-4">
        <StatusBadge status={submission.status} />
      </td>
      <td className="px-6 py-4 text-slate-600 text-sm">
        {submission.content || (
          <span className="text-gray-400 italic">Not submitted yet</span>
        )}
      </td>
      <td className="px-6 py-4">
        <input
          type="number"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-20 px-2 py-1 border rounded-md text-sm"
          placeholder="0-100"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-2 py-1 border rounded-md text-sm"
          placeholder="Optional feedback..."
        />
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
};

// The main view component for the entire page
export default function ExamDetailView({ initialExam }) {
  const [exam, setExam] = useState(initialExam);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  }, []);

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      const res = await fetch(`/api/teacher/exam-submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, feedback }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save grade");
      }
      const updatedSubmission = await res.json();
      // Update the local state to show the change immediately without a page reload
      setExam((prev) => ({
        ...prev,
        submissions: prev.submissions.map((sub) =>
          sub.id === submissionId ? { ...sub, ...updatedSubmission } : sub
        ),
      }));
      showMessage("Grade saved successfully!");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div>
        <Link
          href="/teacher/exam"
          className="text-blue-600 hover:underline text-sm"
        >
          &larr; Back to All Exams
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">
          {exam.title}
        </h1>
        <p className="text-slate-500">
          Submissions for group:{" "}
          <span className="font-semibold">{exam.group.name}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Student Submissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Submission Content</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Feedback</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exam.submissions.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  onGrade={handleGradeSubmission}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
