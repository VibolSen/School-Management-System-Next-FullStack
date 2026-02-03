"use client";

import React, { useState } from "react";
import Link from "next/link";
import ManageGroupMembersModal from "./ManageGroupMembersModal";
import GroupModal from "./GroupModal";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Edit3, 
  UserPlus, 
  MoreVertical 
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GroupDetailPage({ initialGroup, allStudents, role }) {
  const [group, setGroup] = useState(initialGroup);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] =
    useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log("Group members updated successfully!");
      handleCloseManageMembersModal();
    } catch (err) {
      console.error(err.message);
    }
    finally {
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
      console.log("Group details updated successfully!");
      handleCloseEditGroupModal();
    } catch (err) {
      console.error(err.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleCloseManageMembersModal = () =>
    setIsManageMembersModalOpen(false);
  const handleCloseEditGroupModal = () => setIsEditGroupModalOpen(false);

  return (
    <div className="min-h-screen bg-[#EBF4F6] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <Link
              href={`/${role}/groups`}
              className="inline-flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm text-[13px] font-bold mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Groups
            </Link>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Group Details
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditGroupModalOpen(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 rounded-xl text-[13px] font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Group
            </button>
            <button
              onClick={() => setIsManageMembersModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Manage Members
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Group Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {group.name}
                  </h2>
                  <span className="text-[12px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Active Group
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Courses
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed pl-6">
                    {group.courses?.length
                      ? group.courses.map((c) => c.name).join(", ")
                      : "No courses assigned"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    Total Members
                  </div>
                  <p className="text-[13px] text-slate-600 pl-6">
                    {group.students?.length || 0} students enrolled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Student List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[600px]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Enrolled Students
                </h3>
                <span className="text-[12px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {group.students?.length || 0} Students
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {group.students?.length ? (
                  <div className="space-y-1">
                    {group.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center text-[12px] font-black border border-white shadow-sm">
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-[12px] text-slate-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No students enrolled yet</p>
                    <p className="text-[12px] text-slate-400 mt-1">
                      Add students to this group to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

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
    </div>
  );
}
