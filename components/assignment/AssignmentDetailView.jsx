// FILE: components/assignment/AssignmentDetailView.jsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import SubmissionModal from "./SubmissionModal";
import Notification from "@/components/Notification";

const AssignmentDetailView = ({ assignmentId }) => {
  const [assignment, setAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const fetchAssignmentDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/assignments?id=${assignmentId}`);
      if (!res.ok) throw new Error("Failed to fetch assignment details.");
      setAssignment(await res.json());
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [fetchAssignmentDetails]);

  const handleSubmission = async (submissionData) => {
    try {
      // Find the status ID for "Submitted"
      // In a real app, you'd fetch statuses and find the correct one.
      const SUBMITTED_STATUS_ID = "YOUR_SUBMITTED_STATUS_ID"; // Replace with the actual ID

      const payload = {
        ...assignment, // Keep existing data like grade, feedback
        ...assignment.assignment, // Keep parent assignment data
        ...submissionData, // Add the new content and fileUrl
        statusId: SUBMITTED_STATUS_ID,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/assignments?id=${assignmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit.");

      showMessage("Assignment submitted successfully!");
      setIsModalOpen(false);
      fetchAssignmentDetails();
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  if (isLoading)
    return <p className="text-center py-10">Loading assignment details...</p>;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">{assignment.assignment?.title}</h1>
          <p className="text-slate-600 mt-1">
            Course: {assignment.assignment?.course?.title}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Due Date:{" "}
            {new Date(assignment.assignment?.dueDate).toLocaleString()}
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <p className="text-slate-600 whitespace-pre-wrap">
            {assignment.assignment?.description || "No instructions."}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">My Submission</h2>
          <p>
            <strong>Status:</strong> {assignment.status?.name}
          </p>
          <p>
            <strong>Grade:</strong> {assignment.grade ?? "Not Graded"}
          </p>
          <p>
            <strong>Feedback:</strong>{" "}
            {assignment.feedback || "No feedback yet."}
          </p>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg"
            disabled={!!assignment.grade}
          >
            {assignment.content ? "Resubmit Assignment" : "Submit Assignment"}
          </button>
        </div>
      </div>
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmission}
        currentSubmission={assignment}
      />
    </div>
  );
};

export default AssignmentDetailView;
