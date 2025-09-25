"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AssignmentCard from "@/components/assignment/AssignmentCard";
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
  const router = useRouter();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <p className="text-center py-8">Loading your assignments...</p>
          ) : submissions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              You have no assignments yet. Great job!
            </p>
          ) : (
            submissions.map(({ id, status, grade, assignment }) => (
              <AssignmentCard
                key={id}
                assignment={assignment}
                status={status}
                onNavigate={() => router.push(`/student/assignments/${id}`)}
                showActions={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
