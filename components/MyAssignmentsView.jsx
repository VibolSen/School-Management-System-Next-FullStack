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

export default function MyAssignmentsView({ loggedInUser }) {
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

  const fetchAssignments = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/student/my-assignments?studentId=${studentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch your assignments.");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      showMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [studentId, showMessage]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">My Assignments</h1>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Pending & Graded Work
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center py-8">Loading your assignments...</p>
          ) : submissions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              You have no assignments yet. Great job!
            </p>
          ) : (
            submissions.map(({ id, status, grade, assignment }) => (
              // Each assignment is a link to a future submission page
              <Link
                key={id}
                href={`/student/assignments/${id}`}
                className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  {/* Left Side: Details */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge status={status} />
                      <p className="font-semibold text-slate-800 text-lg">
                        {assignment.title}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      From: {assignment.teacher.firstName}{" "}
                      {assignment.teacher.lastName} ({assignment.group.name})
                    </p>
                  </div>
                  {/* Right Side: Grade and Due Date */}
                  <div className="flex-shrink-0 text-left sm:text-right">
                    {status === "GRADED" ? (
                      <p className="text-lg font-bold text-green-600">
                        {grade} / 100
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400">Not Graded Yet</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      Due:{" "}
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleDateString()
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
