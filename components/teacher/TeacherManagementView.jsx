"use client";

import React, { useState, useEffect, useCallback } from "react";
import AddTeacherModal from "./AddTeacherModal";
import TeacherTable from "./TeacherTable";
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Assuming you have this component
import Notification from "@/components/Notification";

export default function TeacherManagementView() {
  const [teachers, setTeachers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersRes, rolesRes, coursesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/roles"),
        fetch("/api/courses"),
      ]);

      if (!usersRes.ok) throw new Error("Failed to fetch users");
      if (!rolesRes.ok) throw new Error("Failed to fetch roles");
      if (!coursesRes.ok) throw new Error("Failed to fetch courses");

      const allUsers = await usersRes.json();
      const rolesData = await rolesRes.json();
      const coursesData = await coursesRes.json();

      setRoles(rolesData);
      setCourses(coursesData);

      // Identify role IDs for "teacher" and "faculty"
      const teacherRoleIds = rolesData
        .filter((r) => ["teacher"].includes(r.name?.toLowerCase()))
        .map((r) => r.id);

      // Filter for users who are teachers and attach the full role object to them
      const teachersOnly = allUsers
        .filter((user) => teacherRoleIds.includes(user.roleId))
        .map((user) => ({
          ...user,
          role: rolesData.find((r) => r.id === user.roleId), // Attach role object
        }));

      setTeachers(teachersOnly);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load required data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleToggleStatus = async (teacherId, currentStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?id=${teacherId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      showMessage(
        `Teacher ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
      fetchData(); // Refresh data to ensure consistency
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
      fetchData(); // Refresh data
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setTeacherToDelete(null);
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setTeacherToDelete(null);
  };

  const handleSaveTeacher = async (teacherData) => {
    setIsLoading(true);
    try {
      const url = editingTeacher
        ? `/api/users?id=${editingTeacher.id}`
        : "/api/users";
      const method = editingTeacher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save teacher data");
      }

      showMessage(
        `Teacher ${editingTeacher ? "updated" : "added"} successfully!`
      );
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  if (isLoading && teachers.length === 0)
    return <p className="text-center py-10">Loading teacher data...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-3xl font-bold text-slate-800">Teacher Management</h1>

      <TeacherTable
        teachers={teachers}
        allCourses={courses}
        onAddTeacherClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <AddTeacherModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveTeacher={handleSaveTeacher}
          teacherToEdit={editingTeacher}
          allCourses={courses}
          allRoles={roles}
        />
      )}

      <ConfirmationDialog
        isOpen={!!teacherToDelete}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete "${teacherToDelete?.name}"?`}
      />
    </div>
  );
}