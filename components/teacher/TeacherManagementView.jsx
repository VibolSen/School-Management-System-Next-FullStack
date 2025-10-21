"use client";

import React, { useState, useEffect, useCallback } from "react";
import AddTeacherModal from "./AddTeacherModal";
import TeacherTable from "./TeacherTable";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

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
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      3000
    );
  };

  // ✅ MODIFIED: Simplified to fetch only teachers using our dedicated API.
  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      // We no longer need to fetch all users and filter; the API does it for us.
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

  // ✅ MODIFIED: The save handler now automatically includes the 'TEACHER' role.
  const handleSaveTeacher = async (teacherData) => {
    setIsLoading(true);
    const isEditing = !!editingTeacher;
    const url = isEditing ? `/api/users?id=${editingTeacher.id}` : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    // Ensure the 'TEACHER' role is always set
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
      await fetchTeachers(); // Refresh data
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
      const res = await fetch(`/api/users?id=${teacherToDelete.id}`, {
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

  // Modal control functions remain the same
  const handleAddClick = () => {
    /* ... */
  };
  const handleEditClick = (teacher) => {
    /* ... */
  };
  const handleDeleteRequest = (teacher) => {
    /* ... */
  };
  const handleCloseModal = () => {
    /* ... */
  };
  const handleCancelDelete = () => {
    /* ... */
  };
  // ✅ REMOVED: handleToggleStatus is obsolete.

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
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
      {canManageTeachers && isModalOpen && (
        <AddTeacherModal
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
    </div>
  );
}
