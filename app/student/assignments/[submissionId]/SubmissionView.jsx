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

export default function SubmissionView({ initialSubmission }) {
  // Use state to manage the submission, so we can update it after a successful submit
  const [submission, setSubmission] = useState(initialSubmission);
  const [content, setContent] = useState("");
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
    if (!content.trim()) {
      showMessage("You cannot submit an empty assignment.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/submissions/${submission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit.");
      }
      const updatedSubmissionData = await res.json();
      setSubmission(updatedSubmissionData); // Update the page with the new submission data
      showMessage("Assignment submitted successfully!");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const { assignment } = submission;

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div>
        <Link
          href="/student/assignments"
          className="text-blue-600 hover:underline text-sm mb-2 inline-block"
        >
          &larr; Back to My Assignments
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {assignment.title}
            </h1>
            <p className="text-slate-500">
              Assigned by: {assignment.teacher.firstName}{" "}
              {assignment.teacher.lastName}
            </p>
          </div>
          <StatusBadge status={submission.status} />
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Due:{" "}
          {assignment.dueDate
            ? new Date(assignment.dueDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      {/* Assignment Description */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          Instructions
        </h2>
        <p className="text-slate-600 whitespace-pre-wrap">
          {assignment.description || "No instructions were provided."}
        </p>
      </div>

      {/* Submission & Grade Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          {submission.status === "PENDING"
            ? "Your Submission"
            : "My Submission & Grade"}
        </h2>

        {submission.status === "PENDING" && (
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 p-3 border rounded-md"
              placeholder="Type your response or paste a link to your work here..."
            ></textarea>
            <div className="text-right mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </form>
        )}

        {submission.status !== "PENDING" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-500">
                SUBMITTED WORK
              </h3>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-md whitespace-pre-wrap">
                {submission.content}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Submitted on:{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
            {submission.status === "GRADED" && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500">
                  GRADE & FEEDBACK
                </h3>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-2xl font-bold text-green-700">
                    {submission.grade} / 100
                  </p>
                  <p className="text-slate-600 mt-2">
                    {submission.feedback || "No feedback provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
