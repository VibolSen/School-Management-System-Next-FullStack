"use client";

import React, { useState, useEffect, useCallback } from "react";
import StaffTable from "./StaffTable";
import AddStaffModal from "./AddStaffModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

// ✅ MODIFIED: Static list of roles available for staff, excluding 'STUDENT'.
const STAFF_ROLES = ["ADMIN", "HR", "FACULTY", "TEACHER"];

export default function StaffManagementView() {
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
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

  // ✅ MODIFIED: Fetches all users, then filters out students.
  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const allUsers = await res.json();

      // Filter out users with the role of "STUDENT"
      const staffOnly = allUsers.filter((user) => user.role !== "STUDENT");
      setStaffList(staffOnly);
    } catch (err) {
      showMessage(`Failed to load staff data: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ REMOVED: fetchRoles is no longer needed as we use a static list.

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddClick = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    const staffMember = staffList.find((s) => s.id === id);
    setItemToDelete(staffMember);
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
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      setStaffList((prev) => prev.filter((s) => s.id !== itemToDelete.id));
      showMessage("Staff member deleted successfully!");
    } catch (err) {
      showMessage(`Failed to delete staff: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  // ✅ MODIFIED: Save logic updated for the new schema.
  const handleSaveStaff = async (staffData) => {
    setIsLoading(true);
    const isEditing = !!editingStaff?.id;
    const endpoint = isEditing
      ? `/api/users?id=${editingStaff.id}`
      : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      showMessage(
        `Staff member ${isEditing ? "updated" : "added"} successfully!`
      );
      await fetchStaff(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      showMessage(`Failed to save staff: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REMOVED: handleToggleStatus function is obsolete.

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>
      <StaffTable
        staffList={staffList}
        allRoles={STAFF_ROLES} // Pass the filtered roles
        onAddStaffClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        // onToggleStatus prop is removed
        isLoading={isLoading}
      />
      {isModalOpen && (
        <AddStaffModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveStaff}
          staffToEdit={editingStaff}
          roles={STAFF_ROLES} // Pass the filtered roles
          isLoading={isLoading}
        />
      )}
      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${itemToDelete?.firstName} ${itemToDelete?.lastName}?`}
        isLoading={isLoading}
      />
    </div>
  );
}
