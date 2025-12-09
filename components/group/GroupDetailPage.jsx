"use client";

import React, { useState } from "react";
import Link from "next/link";
import ManageGroupMembersModal from "./ManageGroupMembersModal";
import GroupModal from "./GroupModal";
import Notification from "../Notification";

export default function GroupDetailPage({ initialGroup, allStudents }) {
  const [group, setGroup] = useState(initialGroup);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] =
    useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const handleSaveMembers = async (studentIds) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/groups?id=${group.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save members.");
      }

      const updatedGroup = await res.json();
      setGroup(updatedGroup);
      showMessage("Group members updated successfully!");
      handleCloseManageMembersModal();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGroupDetails = async (groupData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/groups?id=${group.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update group details.");
      }

      const updatedGroup = await res.json();
      setGroup(updatedGroup);
      showMessage("Group details updated successfully!");
      handleCloseEditGroupModal();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseManageMembersModal = () =>
    setIsManageMembersModalOpen(false);
  const handleCloseEditGroupModal = () => setIsEditGroupModalOpen(false);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {/* Back Button */}
      <div className="mb-6">
          <Link
            href="/admin/groups"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Groups
          </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4 md:mb-0">
          Group Details
        </h1>
      </div>

      {/* ============================
          2-COLUMN LAYOUT STARTS HERE
      ============================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN — Group Info */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            {group.name}
          </h2>

          <div className="space-y-3 text-slate-700">

            <p>
              <span className="font-semibold">Courses:</span>{" "}
              {group.courses?.length
                ? group.courses.map((c) => c.name).join(", ")
                : "N/A"}
            </p>

            <p>
              <span className="font-semibold">Total Members:</span>{" "}
              {group.students?.length || 0}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => setIsEditGroupModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              Edit Group
            </button>

            <button
              onClick={() => setIsManageMembersModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition"
            >
              Manage Members
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Students */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-slate-100">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Enrolled Students
          </h3>

          {group.students?.length ? (
            <ul className="divide-y divide-slate-200 max-h-[500px] overflow-y-auto pr-2">
              {group.students.map((student) => (
                <li
                  key={student.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">
              No students enrolled in this group.
            </p>
          )}
        </div>
      </div>
      {/* ============================
          END 2-COLUMN LAYOUT
      ============================ */}

      {/* Modals */}
      {isManageMembersModalOpen && (
        <ManageGroupMembersModal
          isOpen={isManageMembersModalOpen}
          onClose={handleCloseManageMembersModal}
          group={group}
          allStudents={allStudents}
          onSaveChanges={handleSaveMembers}
          isLoading={isLoading}
        />
      )}

      {isEditGroupModalOpen && (
        <GroupModal
          isOpen={isEditGroupModalOpen}
          onClose={handleCloseEditGroupModal}
          onSave={handleSaveGroupDetails}
          groupToEdit={group}
          courses={group.courses}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
