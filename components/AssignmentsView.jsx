"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AddAssignmentModal from "./AddAssignmentModal";
import Notification from "@/components/Notification"; // Assuming you have this component

export default function AssignmentsView({ loggedInUser }) {
  const [assignments, setAssignments] = useState([]);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // ✅ FIX #1: Extract the user ID into a stable primitive variable.
  const teacherId = loggedInUser?.id;

  // This function will be stable and only recreated if teacherId changes.
  const showMessage = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  }, []); // Empty dependency array means this function is created only once.

  // ✅ FIX #2: Wrap the data fetching logic in useCallback with its stable dependency.
  const fetchData = useCallback(async () => {
    if (!teacherId) return;
    setIsLoading(true);
    try {
      const [assignmentsRes, groupsRes] = await Promise.all([
        fetch(`/api/teacher/assignments?teacherId=${teacherId}`),
        fetch(`/api/teacher/my-groups?teacherId=${teacherId}`),
      ]);
      if (!assignmentsRes.ok) throw new Error("Failed to fetch assignments");
      if (!groupsRes.ok) throw new Error("Failed to fetch your groups");

      setAssignments(await assignmentsRes.json());
      setTeacherGroups(await groupsRes.json());
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, showMessage]); // Dependencies are stable.

  // ✅ FIX #3: The main useEffect hook now depends on the stable fetchData function.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveAssignment = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, teacherId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create assignment");
      }
      showMessage("Assignment created successfully!");
      setIsModalOpen(false);
      await fetchData(); // Re-fetch data after a successful save
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // The rest of your JSX remains the same
  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Assignments</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          disabled={teacherGroups.length === 0}
          title={
            teacherGroups.length === 0
              ? "You must have a group to create an assignment"
              : "Create new assignment"
          }
        >
          Add Assignment
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          My Assignments List
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              You have not created any assignments yet.
            </p>
          ) : (
            assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/teacher/assignment/${assignment.id}`}
                className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      Assigned to:{" "}
                      <span className="font-medium">
                        {assignment.group.name}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      Submissions:
                      <span className="font-bold text-slate-700">
                        {" "}
                        {assignment._count.submissions} /{" "}
                        {assignment.totalStudents}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
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

      <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAssignment}
        teacherGroups={teacherGroups}
        isLoading={isLoading}
      />
    </div>
  );
}
