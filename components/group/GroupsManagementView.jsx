"use client";

import React, { useState, useEffect, useCallback } from "react";
import GroupsTable from "./GroupTable";
import GroupModal from "./GroupModal";
import ManageGroupMembersModal from "./ManageGroupMembersModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

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
        onManageMembers={handleManageMembersClick}
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
    </div>
  );
}
