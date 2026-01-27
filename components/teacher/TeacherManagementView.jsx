"use client";

import React, { useState, useEffect, useCallback } from "react";
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
    <div className="space-y-4 animate-fadeIn duration-700">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700 animate-scale-in">
          Teacher Management
        </h1>
      </div>
      <TeacherTable
        teachers={teachers}
        onAddTeacherClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        isLoading={isLoading}
        canManageTeachers={canManageTeachers}
        currentUserRole={currentUser?.role}
      />
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