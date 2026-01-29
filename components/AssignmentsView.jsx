"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AssignmentModal from "./AssignmentModal";

import AssignmentCard from "./assignment/AssignmentCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AssignmentsView({ loggedInUser }) {
  // STATE MANAGEMENT
  const [assignments, setAssignments] = useState([]);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const router = useRouter();
  const teacherId = loggedInUser?.id;

  // HELPER FUNCTIONS

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
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

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
      console.log("Assignment created successfully!");
      setIsAddModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setAssignmentToEdit(assignment);
    setIsEditModalOpen(true);
  };

  const handleUpdateAssignment = async (formData) => {
    if (!assignmentToEdit) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/teacher/assignments/${assignmentToEdit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update assignment");
      }
      console.log("Assignment updated successfully!");
      setIsEditModalOpen(false);
      setAssignmentToEdit(null);
      await fetchData();
    } catch (err) {
      console.error(err.message);
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
      console.log("Assignment deleted successfully!");
      await fetchData();
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setAssignmentToDelete(null);
    }
  };

  // MAIN RENDER
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assignments
            </h1>
            <p className="text-slate-600 mt-1">
              Create and manage assignments for your classes
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={teacherGroups.length === 0}
            title={
              teacherGroups.length === 0
                ? "You must have a group to create an assignment"
                : "Create new assignment"
            }
            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Assignment
            </span>
            {teacherGroups.length === 0 && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Create a group first
              </div>
            )}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">
                  {assignments.length}
                </p>
                <p className="text-slate-600 text-xs">Total Assignments</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">
                  {teacherGroups.length}
                </p>
                <p className="text-slate-600 text-xs">Active Groups</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-slate-600 text-xs">Today's Date</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              All Assignments
            </h2>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner size="lg" color="blue" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-10">
              <div className="max-w-sm mx-auto">
                <div className="w-20 h-20 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-2">
                  No Assignments Yet
                </h3>
                <p className="text-slate-500 mb-4">
                  Create your first assignment to get started with your classes.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={teacherGroups.length === 0}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-normal hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Create Your First Assignment
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className="transform hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AssignmentCard
                    assignment={assignment}
                    onNavigate={() =>
                      router.push(`/teacher/assignment/${assignment.id}`)
                    }
                    onEdit={() => handleEdit(assignment)}
                    onDelete={() => handleDelete(assignment.id)}
                    userRole={loggedInUser?.role} // Add this line
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AssignmentModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setAssignmentToEdit(null);
        }}
        onSave={assignmentToEdit ? handleUpdateAssignment : handleSaveAssignment}
        teacherGroups={teacherGroups}
        isLoading={isLoading}
        assignment={assignmentToEdit}
      />

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-red-100 rounded-md">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  Delete Assignment
                </h2>
              </div>
              <p className="text-slate-600 text-sm">
                Are you sure you want to delete this assignment? This will also
                remove all student submissions. This action cannot be undone.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t rounded-b-xl flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-normal hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-normal shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="xs" color="white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
