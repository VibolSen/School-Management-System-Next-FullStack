"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AssignmentModal from "../AssignmentModal";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AssignmentCard from "./AssignmentCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Users, Calendar, Plus, RefreshCcw } from "lucide-react";

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]); // To store all groups for assignment creation/editing
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  // Confirmation States
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showMessage = (message, type = "success") => {
    if (type === "error") {
      setErrorMessage(message);
      setIsErrorModalOpen(true);
    } else {
      setSuccessMessage(message);
      setIsSuccessModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [assignmentsRes, groupsRes] = await Promise.all([
        fetch("/api/assignments"), // Fetch all assignments
        fetch("/api/groups"), // Fetch all groups
      ]);

      if (!assignmentsRes.ok) throw new Error("Failed to fetch assignments");
      if (!groupsRes.ok) throw new Error("Failed to fetch groups");

      setAssignments(await assignmentsRes.json());
      setGroups(await groupsRes.json());
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveAssignment = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create assignment");
      }
      showMessage("Assignment created successfully!", "success");
      setIsAddModalOpen(false);
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
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
        `/api/assignments/${assignmentToEdit.id}`,
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
      showMessage("Assignment updated successfully!", "success");
      setIsEditModalOpen(false);
      setAssignmentToEdit(null);
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
        `/api/assignments/${assignmentToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete assignment");
      }
      showMessage("Assignment deleted successfully!", "success");
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setAssignmentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Activity & Assignments
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Coordinate student tasks, monitor submission progress, and manage academic activity timelines.
          </p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "TEACHER") && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} />
            Dispatch Assignment
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{assignments.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Assignments</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{groups.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Groups</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Calendar Today</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Assignment Roll</h2>
          </div>
          <button
            onClick={fetchData}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Refresh Feed"
          >
            <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
              <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Feed...</span>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-20">
              <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Active Assignments</h3>
              <p className="text-slate-500 text-xs mt-1">The activity feed is currently empty.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.4) }}
                >
                  <AssignmentCard
                    assignment={assignment}
                    onNavigate={() =>
                      router.push(`/admin/assignment/${assignment.id}`)
                    }
                    onEdit={() => handleEdit(assignment)}
                    onDelete={() => handleDelete(assignment.id)}
                    userRole={user?.role}
                  />
                </motion.div>
              ))}
            </motion.div>
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
        teacherGroups={groups} // Pass all groups to the modal
        isLoading={isLoading}
        assignment={assignmentToEdit}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This will also remove all student submissions. This action cannot be undone."
        isLoading={isLoading}
      />

      <ConfirmationDialog
        isOpen={isSuccessModalOpen}
        title="Success"
        message={successMessage}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
        isLoading={isLoading}
        confirmText="OK"
        type="success"
      />

      <ConfirmationDialog
        isOpen={isErrorModalOpen}
        title="Error"
        message={errorMessage}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        isLoading={isLoading}
        confirmText="OK"
        type="danger"
      />

    </div>
  );
}
