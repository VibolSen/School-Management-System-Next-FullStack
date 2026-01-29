"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";


// Helper component for status badges
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-gray-200 text-gray-800",
    SUBMITTED: "bg-blue-200 text-blue-800",
    GRADED: "bg-green-200 text-green-800",
  };
  return (
    <span
      className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

// Component for a single row in the grading table
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
      <td className="px-4 py-3 font-normal text-gray-800">{`${submission.student.firstName} ${submission.student.lastName}`}</td>
      <td className="px-4 py-3">
        <StatusBadge status={submission.status} />
      </td>
      <td className="px-4 py-3 text-slate-600 text-sm">
        {submission.content || (
          <span className="text-gray-400 italic">Not submitted yet</span>
        )}
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-20 px-1.5 py-0.5 border rounded-sm text-xs"
          placeholder="0-100"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-1.5 py-0.5 border rounded-sm text-xs"
          placeholder="Optional feedback..."
        />
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-2 py-0.5 rounded-sm text-xs font-normal hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
};

// The main view component for the entire page
export default function GradingView({ initialAssignment }) {
  const [assignment, setAssignment] = useState(initialAssignment);


  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      // Adjusted API endpoint for admin
      const res = await fetch(`/api/admin/submissions/${submissionId}`, {
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
      setAssignment((prev) => ({
        ...prev,
        submissions: prev.submissions.map((sub) =>
          sub.id === submissionId ? { ...sub, ...updatedSubmission } : sub
        ),
      }));
      console.log("Grade saved successfully!");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          {assignment.title}
        </h1>
        <Link
          href="/admin/assignment-management" // Adjusted back link for admin
          className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Assignments
          </span>
        </Link>
      </div>
      <p className="text-slate-500 text-sm">
        Grading for group:{" "}
        <span className="font-semibold">{assignment.group.name}</span>
      </p>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-slate-800">
          Student Submissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Submission Content</th>
                <th className="px-4 py-2">Grade</th>
                <th className="px-4 py-2">Feedback</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignment.submissions.map((submission) => (
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
