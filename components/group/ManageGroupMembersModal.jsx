"use client";

import React from "react";
import { createPortal } from "react-dom";
import ManageGroupMembers from "@/app/admin/groups/[groupId]/ManageGroupMembers";

export default function ManageGroupMembersModal({
  isOpen,
  onClose,
  group,
  allStudents,
  onSaveChanges,
  isLoading,
}) {
  if (!isOpen || !group) return null;

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              Manage Members for {group.name}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <ManageGroupMembers
            initialGroup={group}
            allStudents={allStudents}
            onSaveChanges={onSaveChanges}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
