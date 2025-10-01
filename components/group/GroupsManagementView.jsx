"use client";

import React, { useState, useEffect, useCallback } from "react";
import GroupsTable from "./GroupTable";
import GroupModal from "./GroupModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

export default function GroupManagementView({ role }) {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [groupsRes, coursesRes] = await Promise.all([
        fetch("/api/groups"),
        fetch("/api/courses"),
      ]);
      if (!groupsRes.ok) throw new Error("Failed to fetch groups.");
      if (!coursesRes.ok) throw new Error("Failed to fetch courses.");

      setGroups(await groupsRes.json());
      setCourses(await coursesRes.json());
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Group Management</h1>
      </div>
      <GroupsTable
        groups={groups}
        courses={courses}
        onAddGroupClick={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteRequest}
        isLoading={isLoading}
        role={role}
      />
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
      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Group"
        message={`Are you sure you want to delete the "${itemToDelete?.name}" group?`}
        isLoading={isLoading}
      />
    </div>
  );
}
