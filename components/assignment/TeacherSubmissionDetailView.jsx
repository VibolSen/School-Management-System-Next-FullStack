"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

const TeacherSubmissionDetailView = ({ submission: initialSubmission }) => {
  const [submission, setSubmission] = useState(initialSubmission);
  const [grade, setGrade] = useState(initialSubmission.grade || "");
  const [feedback, setFeedback] = useState(initialSubmission.feedback || "");
  const [statusId, setStatusId] = useState(initialSubmission.statusId);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch("/api/student-statuses"); // Assuming an API for statuses
        if (!res.ok) throw new Error("Failed to fetch statuses");
        const data = await res.json();
        setStatuses(data);
      } catch (err) {
      console.error(err.message);
      }
    };
    fetchStatuses();
  }, []);


  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/teacher/submissions/${submission.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grade, feedback, statusId }),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update submission");
      }
      const updated = await res.json();
      setSubmission(updated);
      console.log("Submission updated successfully!");
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!submission) {
    return <p className="text-center py-10">Submission not found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Submission for: {submission.assignment.title}
          </h1>
          <p className="text-slate-600 mt-1">
            Student: {submission.student.firstName}{" "}
            {submission.student.lastName}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Course: {submission.assignment.course.title}
          </p>
          <p className="text-sm text-slate-500">
            Submitted On:{" "}
            {submission.submittedAt
              ? new Date(submission.submittedAt).toLocaleString()
              : "N/A"}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Content</h2>
          <p className="text-slate-600 whitespace-pre-wrap">
            {submission.content || "No content submitted."}
          </p>
          {submission.fileUrl && (
            <p className="mt-2">
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Submitted File
              </a>
            </p>
          )}
        </div>

        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Grading</h2>
          <div className="mb-4">
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-slate-700"
            >
              Grade (out of 100)
            </label>
            <input
              type="number"
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              min="0"
              max="100"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-slate-700"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-700"
            >
              Status
            </label>
            <select
              id="status"
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Grade & Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubmissionDetailView;
