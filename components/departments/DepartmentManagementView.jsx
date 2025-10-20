"use client";

import React, { useState, useEffect, useCallback } from "react";
import DepartmentsTable from "./DepartmentsTable";
import DepartmentModal from "./DepartmentModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

export default function DepartmentManagementView() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]); // New state for faculties
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const API_ENDPOINT = "/api/departments";
  const FACULTY_API_ENDPOINT = "/api/faculty"; // New API endpoint for faculties

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch departments.");
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFaculties = useCallback(async () => {
    try {
      const response = await fetch(FACULTY_API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch faculties.");
      const data = await response.json();
      setFaculties(data);
    } catch (err) {
      showMessage(err.message, "error");
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchFaculties(); // Fetch faculties on mount
  }, [fetchDepartments, fetchFaculties]);

  const handleSaveDepartment = async (formData) => {
    setIsLoading(true);
    const isEditing = !!editingDepartment;
    const url = isEditing
      ? `${API_ENDPOINT}?id=${editingDepartment.id}`
      : API_ENDPOINT;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }
      showMessage(
        `Department ${isEditing ? "updated" : "created"} successfully!`
      );
      await fetchDepartments();
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
      const response = await fetch(`${API_ENDPOINT}?id=${itemToDelete.id}`, {
        method: "DELETE",
      });
      // A successful DELETE often returns 204 No Content
      if (!response.ok) {
        let errorMessage = "Failed to delete the department.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // The response body is not JSON. Use the default error message.
        }
        throw new Error(errorMessage);
      }
      showMessage("Department deleted successfully!");
      setDepartments((prevDepts) =>
        prevDepts.filter((d) => d.id !== itemToDelete.id)
      );
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleAddClick = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (department) => {
    setItemToDelete(department);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Department Management
        </h1>
      </div>

      <DepartmentsTable
        departments={departments}
        onAddDepartmentClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <DepartmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDepartment}
          departmentToEdit={editingDepartment}
          isLoading={isLoading}
          faculties={faculties} // Pass faculties here
        />
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete the "${itemToDelete?.name}" department? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
}
