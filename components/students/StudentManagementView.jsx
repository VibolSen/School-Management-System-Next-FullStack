"use client";

import React, { useState, useEffect, useCallback } from "react";
import AddStudentModal from "./AddStudentModal";
import StudentTable from "./StudentTable";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

const STUDENT_ROLE = "STUDENT";

export default function StudentManagementView() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
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

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Student Management
        </h1>
      </div>

      <StudentTable
        students={students}
        onAddStudentClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <AddStudentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveStudent={handleSaveStudent}
          studentToEdit={editingStudent}
        />
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete student ${itemToDelete?.firstName} ${itemToDelete?.lastName}?`}
        isLoading={isLoading}
      />
    </div>
  );
}
