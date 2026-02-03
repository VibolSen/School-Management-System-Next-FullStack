"use client";

import React, { useState, useEffect, useCallback } from "react";
import GroupsTable from "./GroupTable";
import GroupModal from "./GroupModal";
import ManageGroupMembersModal from "./ManageGroupMembersModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export default function GroupManagementView({ role }) {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupForMemberManagement, setGroupForMemberManagement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [groupsRes, coursesRes, studentsRes] = await Promise.all([
        fetch("/api/groups"),
        fetch("/api/courses"),
        fetch("/api/users?role=STUDENT"),
      ]);
      if (!groupsRes.ok) throw new Error("Failed to fetch groups.");
      if (!coursesRes.ok) throw new Error("Failed to fetch courses.");
      if (!studentsRes.ok) throw new Error("Failed to fetch students.");

      setGroups(await groupsRes.json());
      setCourses(await coursesRes.json());
      setAllStudents(await studentsRes.json());
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (groupData) => {
    setIsLoading(true);
    const isEditing = !!editingGroup;
    const endpoint = isEditing
      ? `/api/groups?id=${editingGroup.id}`
      : "/api/groups";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save group.");
      }
      showMessage(`Group ${isEditing ? "updated" : "created"} successfully!`);
      await fetchData();
      handleCloseModal();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMembers = async (studentIds) => {
    if (!groupForMemberManagement) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/groups?id=${groupForMemberManagement.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentIds }),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save members.");
      }
      showMessage("Group members updated successfully!");
      await fetchData();
      handleCloseManageMembersModal();
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
      const res = await fetch(`/api/groups?id=${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.status !== 204 && !res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete group.");
      }
      showMessage("Group deleted successfully!");
      setGroups((prev) => prev.filter((g) => g.id !== itemToDelete.id));
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleAddClick = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (group) => {
    setItemToDelete(group);
  };

  const handleManageMembersClick = (group) => {
    setGroupForMemberManagement(group);
    setIsManageMembersModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleCloseManageMembersModal = () => {
    setIsManageMembersModalOpen(false);
    setGroupForMemberManagement(null);
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
            Academic Groups
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Organize student cohorts, manage course assignments, and coordinate group-based academic activities.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={14} />
          Create New Group
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <GroupsTable
          groups={groups}
          courses={courses}
          onAddGroupClick={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteRequest}
          onManageMembers={handleManageMembersClick}
          isLoading={isLoading}
          role={role}
        />
      </motion.div>
      {isModalOpen && (
        <GroupModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          groupToEdit={editingGroup}
          courses={courses}
          isLoading={isLoading}
        />
      )}
      {isManageMembersModalOpen && (
        <ManageGroupMembersModal
          isOpen={isManageMembersModalOpen}
          onClose={handleCloseManageMembersModal}
          group={groupForMemberManagement}
          allStudents={allStudents}
          onSaveChanges={handleSaveMembers}
          isLoading={isLoading}
        />
      )}
      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Group"
        message={`Are you sure you want to delete the "${itemToDelete?.name}" group?`}
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
