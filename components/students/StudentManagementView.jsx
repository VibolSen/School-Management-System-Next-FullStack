"use client";


import React, { useState, useEffect, useCallback } from "react";
import StudentTable from "./StudentTable";
import StudentModal from "./StudentModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import { useUser } from "@/context/UserContext";

const STUDENT_ROLE = "STUDENT";

export default function StudentManagementView() {
  const { user: currentUser } = useUser();
  const canManageStudents = currentUser?.role === "ADMIN" || currentUser?.role === "STUDY_OFFICE";
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
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

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const resUsers = await fetch("/api/users?role=STUDENT");
      if (!resUsers.ok)
        throw new Error(`HTTP error! status: ${resUsers.status}`);
      const allUsers = await resUsers.json();
      setStudents(allUsers);
    } catch (err) {
      showMessage(`Failed to load student data: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddClick = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    const student = students.find((s) => s.id === id);
    setItemToDelete(student);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?id=${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error! status: ${res.status}`);
      }
      setStudents((prev) => prev.filter((s) => s.id !== itemToDelete.id));
      showMessage("Student deleted successfully!");
    } catch (err) {
      showMessage(`Failed to delete student: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = async (studentData) => {
    setIsLoading(true);
    const isEditing = !!editingStudent?.id;
    const endpoint = isEditing
      ? `/api/users?id=${editingStudent.id}`
      : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    const payload = { ...studentData };
    if (!isEditing) {
      payload.role = STUDENT_ROLE;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      showMessage(`Student ${isEditing ? "updated" : "added"} successfully!`);
      await fetchStudents();
      handleCloseModal();
    } catch (err) {
      showMessage(`Failed to save student: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Student Management
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Maintain student records, enrollment status, and academic profiles.
          </p>
        </div>
        {canManageStudents && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} />
            Add New Student
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StudentTable
          students={students}
          onAddStudentClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteRequest}
          isLoading={isLoading}
          currentUserRole={currentUser?.role}
          canManageStudents={canManageStudents}
        />
      </motion.div>

      {canManageStudents && isModalOpen && (
        <StudentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveStudent={handleSaveStudent}
          studentToEdit={editingStudent}
        />
      )}

      {canManageStudents && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onCancel={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Student"
          message={`Are you sure you want to delete student ${itemToDelete?.firstName} ${itemToDelete?.lastName}?`}
          isLoading={isLoading}
        />
      )}
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