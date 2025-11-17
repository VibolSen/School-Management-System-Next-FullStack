"use client";

import React, { useState, useEffect, useCallback } from "react";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import ConfirmationDialog from "../ConfirmationDialog";
import Notification from "@/components/Notification";

// ✅ MODIFIED: Roles are now a static list based on your Prisma Enum
import { useUser } from "@/context/UserContext";

const ROLES = ["ADMIN", "HR", "FACULTY", "TEACHER", "STUDENT", "STUDY_OFFICE"];

export default function UserManagementView() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ REMOVED: `fetchRoles` is no longer needed.

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData) => {
    setIsLoading(true);
    // ✅ MODIFIED: The endpoint is simplified based on your route file
    const isEditing = !!editingUser?.id;
    const endpoint = isEditing
      ? `/api/users?id=${editingUser.id}`
      : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`
        );
      }

      setSuccessMessage(`User ${isEditing ? "updated" : "created"} successfully!`);
      setIsSuccessModalOpen(true);
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REMOVED: `handleToggleStatus` is no longer applicable.

  const handleDeleteClick = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?id=${userToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete user.");
      }
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      showMessage("User deleted successfully!");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
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
    <div className="space-y-6 animate-fadeIn">

      <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
      <UserTable
        users={users}
        allRoles={ROLES} // ✅ MODIFIED: Pass the static roles array
        onAddUserClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        isLoading={isLoading} // Simplified loading state
        currentUserRole={currentUser?.role}
      />
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          userToEdit={editingUser}
          roles={ROLES} // ✅ MODIFIED: Pass the static roles array
          isLoading={isLoading}
        />
      )}
      <ConfirmationDialog
        isOpen={isConfirmModalOpen}
        title="Confirm Deletion"
        // ✅ MODIFIED: Updated confirmation message for new schema
        message={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
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
