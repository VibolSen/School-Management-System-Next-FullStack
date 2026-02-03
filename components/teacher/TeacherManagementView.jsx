"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import TeacherModal from "./TeacherModal";
import TeacherTable from "./TeacherTable";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { useUser } from "@/context/UserContext";

const TEACHER_ROLE = "TEACHER";

export default function TeacherManagementView() {
  const { user: currentUser } = useUser();
  const canManageTeachers = currentUser?.role === "ADMIN" || currentUser?.role === "HR";
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const teachersRes = await fetch("/api/users/teachers");
      if (!teachersRes.ok) throw new Error("Failed to fetch teachers");

      const teachersData = await teachersRes.json();
      setTeachers(teachersData);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSaveTeacher = async (teacherData) => {
    setIsLoading(true);
    const isEditing = !!editingTeacher;
    const url = isEditing ? `/api/users/teachers/${editingTeacher.id}` : "/api/users/teachers";
    const method = isEditing ? "PUT" : "POST";

    const payload = { ...teacherData, role: TEACHER_ROLE };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save teacher data");
      }
      showMessage(`Teacher ${isEditing ? "added" : "updated"} successfully!`);
      await fetchTeachers();
      handleCloseModal();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/teachers/${teacherToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete teacher");
      showMessage("Teacher deleted successfully!");
      setTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete.id));
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setTeacherToDelete(null);
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };
  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };
  const handleDeleteRequest = (teacher) => {
    setTeacherToDelete(teacher);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };
  const handleCancelDelete = () => {
    setTeacherToDelete(null);
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
            Academic Faculty
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Manage your teaching staff, department assignments, and instructor roles.
          </p>
        </div>
        {canManageTeachers && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} />
            Register Instructor
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TeacherTable
          teachers={teachers}
          onAddTeacherClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteRequest}
          isLoading={isLoading}
          canManageTeachers={canManageTeachers}
          currentUserRole={currentUser?.role}
        />
      </motion.div>
      {isModalOpen && (
        <TeacherModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveTeacher={handleSaveTeacher}
          teacherToEdit={editingTeacher}
        />
      )}
      {canManageTeachers && (
        <ConfirmationDialog
          isOpen={!!teacherToDelete}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Teacher"
          message={`Are you sure you want to delete ${teacherToDelete?.firstName} ${teacherToDelete?.lastName}?`}
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