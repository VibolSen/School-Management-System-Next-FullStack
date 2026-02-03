"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_ROLES = ["ADMIN", "HR", "TEACHER", "STUDY_OFFICE"];

export default function StaffManagementView() {
  const { user, loading: userLoading } = useUser();
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const availableStaffRoles = useMemo(() => {
    if (user?.role === "ADMIN") {
      return ALL_ROLES;
    }
    if (user?.role === "HR") {
      return ALL_ROLES;
    }
    return [];
  }, [user?.role]);

  const showMessage = (message, type = "success") => {
    if (type === "error") {
      setErrorMessage(message);
      setIsErrorModalOpen(true);
    } else {
      setSuccessMessage(message);
      setIsSuccessModalOpen(true);
    }
  };

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const allUsers = await res.json();

      const staffOnly = allUsers.filter((user) => user.role !== "STUDENT");
      setStaffList(staffOnly);
    } catch (err) {
      showMessage(`Failed to load staff data: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
            Academic & Support Staff
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Manage administrative personnel, support departments, and coordinate academic staff roles.
          </p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "HR") && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} />
            Register Staff Member
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >

        <StaffTable
          staffList={staffList}
          allRoles={availableStaffRoles}
          onAddStaffClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteRequest}
          isLoading={isLoading || userLoading}
          currentUserRole={user?.role}
        />
      </motion.div>

      {isModalOpen && (
        <StaffModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveStaff}
          staffToEdit={editingStaff}
          roles={availableStaffRoles}
          isLoading={isLoading || userLoading}
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