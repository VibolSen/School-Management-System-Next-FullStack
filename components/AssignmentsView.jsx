"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddAssignmentModal from "./AddAssignmentModal";
import Notification from "@/components/Notification";
import AssignmentCard from "./assignment/AssignmentCard"; // This component should be in the same folder

export default function AssignmentsView({ loggedInUser }) {
  // STATE MANAGEMENT
  const [assignments, setAssignments] = useState([]);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const router = useRouter();
  const teacherId = loggedInUser?.id;

  // HELPER FUNCTIONS
  const showMessage = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  }, []);

  // DATA FETCHING LOGIC
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
  }, [teacherId, showMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD HANDLERS
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
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (assignmentId) => {
    setAssignmentToDelete(assignmentId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/teacher/assignments/${assignmentToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete assignment");
      }
      showMessage("Assignment deleted successfully!");
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setAssignmentToDelete(null);
    }
  };

  // MAIN RENDER
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
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
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

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-8 text-slate-500">
            Loading assignments...
          </p>
        ) : assignments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="font-semibold text-slate-700">No Assignments Found</p>
            <p className="text-slate-500 mt-2">
              Click "Add Assignment" to get started.
            </p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onNavigate={() =>
                router.push(`/teacher/assignment/${assignment.id}`)
              }
              onDelete={() => handleDelete(assignment.id)}
            />
          ))
        )}
      </div>

      <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAssignment}
        teacherGroups={teacherGroups}
        isLoading={isLoading}
      />

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800">
                Confirm Deletion
              </h2>
              <p className="text-slate-500 mt-2">
                Are you sure you want to delete this assignment? This will also
                remove all student submissions. This action cannot be undone.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-white border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
