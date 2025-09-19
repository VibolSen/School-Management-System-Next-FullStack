"use client";

import React, { useState, useEffect, useCallback } from "react";
import CoursesTable from "./CourseTable";
import CourseModal from "./CourseModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

export default function CourseManagementView() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [coursesRes, deptsRes, teachersRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/departments"),
        fetch("/api/users?role=TEACHER"),
      ]);

      if (!coursesRes.ok) throw new Error("Failed to fetch courses.");
      if (!deptsRes.ok) throw new Error("Failed to fetch departments.");
      if (!teachersRes.ok) throw new Error("Failed to fetch teachers.");

      setCourses(await coursesRes.json());
      setDepartments(await deptsRes.json());
      setTeachers(await teachersRes.json());
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (courseData) => {
    setIsLoading(true);
    const isEditing = !!editingCourse;
    const endpoint = isEditing
      ? `/api/courses?id=${editingCourse.id}`
      : "/api/courses";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save course.");
      }
      showMessage(`Course ${isEditing ? "updated" : "created"} successfully!`);
      await fetchData();
      handleCloseModal();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses?id=${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.status !== 204 && !res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete the course.");
      }
      showMessage("Course deleted successfully!");
      setCourses((prev) => prev.filter((c) => c.id !== itemToDelete.id));
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleAddClick = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (course) => {
    setItemToDelete(course);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Course Management</h1>
      </div>

      <CoursesTable
        courses={courses}
        departments={departments}
        teachers={teachers}
        onAddCourseClick={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteRequest}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          courseToEdit={editingCourse}
          departments={departments}
          teachers={teachers}
          isLoading={isLoading}
        />
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete the "${itemToDelete?.name}" course? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
}
