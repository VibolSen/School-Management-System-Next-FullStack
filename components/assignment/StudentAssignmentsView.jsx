// FILE: components/assignment/StudentAssignmentsView.jsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import AssignmentsTable from "./AssignmentsTable";
import StudentAssignmentModal from "./StudentAssignmentModal";

import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function StudentAssignmentView() {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);


  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/assignments");
      if (!res.ok) throw new Error("Failed to load assignments.");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err.message);
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAddClick = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/assignments?id=${itemToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})); // Handle empty error responses
        throw new Error(errData.error || "Failed to delete assignment");
      }
      console.log("Assignment deleted for all students successfully!");
      fetchAssignments(); // Refresh the list
      setItemToDelete(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const handleSaveAssignment = async (formData) => {
    try {
      const url = editingAssignment
        ? `/api/assignments?id=${editingAssignment.id}`
        : "/api/assignments";
      const method = editingAssignment ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save assignment");
      }

      console.log(
        `Assignment ${
          editingAssignment ? "details updated" : "created"
        } successfully!`
      );
      fetchAssignments();
    } catch (err) {
      console.error(err.message);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Assignments</h1>
        <p className="text-slate-500 mt-1">
          Manage all student and group assignments.
        </p>
      </div>
      <AssignmentsTable
        assignments={assignments}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        isLoading={isLoading}
      />
      {isModalOpen && (
        <StudentAssignmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAssignment}
          assignmentToEdit={editingAssignment}
        />
      )}
      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Assignment"
          message="This will delete the assignment for all students in the group. Are you sure?"
        />
      )}
    </div>
  );
}