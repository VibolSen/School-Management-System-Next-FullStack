"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import ExamCard from "./ExamCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function ExamManagement({ loggedInUser }) {
  const [exams, setExams] = useState([]);
  const [allGroups, setAllGroups] = useState([]); // For admin
  const [teacherGroups, setTeacherGroups] = useState([]); // For teacher
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const router = useRouter();
  const userRole = loggedInUser?.role?.toLowerCase(); // Ensure it's lowercase at definition
  const teacherId = loggedInUser?.id;


  const [isUnauthorized, setIsUnauthorized] = useState(false); // New state variable

  // Confirmation States
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

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  const fetchData = useCallback(async () => {
    console.log("fetchData called. loggedInUser:", loggedInUser, "userRole:", userRole); // Debug log

    if (!loggedInUser) {
      setIsUnauthorized(true);
      setIsLoading(false);
      return;
    }
    
    // The userRole is already defined and lowercased at the component level
    // No need to redefine here: const userRole = loggedInUser.role?.toLowerCase(); 

    if (userRole !== "admin" && userRole !== "teacher" && userRole !== "study_office") {
      setIsUnauthorized(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let examsRes, groupsRes;
      if (userRole === "admin" || userRole === "study_office") {
        [examsRes, groupsRes] = await Promise.all([
          fetch("/api/exams"),
          fetch("/api/groups"),
        ]);
        if (userRole === "admin") {
          setAllGroups(await groupsRes.json());
        }
      } else if (userRole === "teacher") {
        [examsRes, groupsRes] = await Promise.all([
          fetch(`/api/teacher/exams?teacherId=${teacherId}`),
          fetch(`/api/teacher/my-groups?teacherId=${teacherId}`),
        ]);
        setTeacherGroups(await groupsRes.json());
      }

      if (!examsRes.ok) throw new Error("Failed to fetch exams");
      if (!groupsRes.ok) throw new Error("Failed to fetch groups");

      setExams(await examsRes.json());
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loggedInUser, teacherId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isUnauthorized) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-3xl font-bold text-red-700 mb-4">Access Denied</h2>
          <p className="text-lg text-slate-700">
            You do not have permission to view this page.
          </p>
          <p className="text-md text-slate-500 mt-2">
            Please log in with an authorized account or contact support.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveExam = async (formData) => {
    setIsLoading(true);
    try {
      const payload = userRole === "teacher" ? { ...formData, teacherId } : formData;
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create exam");
      }
      showMessage("Exam created successfully!", "success");
      setIsAddModalOpen(false);
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (exam) => {
    setExamToEdit(exam);
    setIsEditModalOpen(true);
  };

  const handleUpdateExam = async (formData) => {
    if (!examToEdit) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/exams/${examToEdit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update exam");
      }
      showMessage("Exam updated successfully!", "success");
      setIsEditModalOpen(false);
      setExamToEdit(null);
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (examId) => {
    setExamToDelete(examId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/exams/${examToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete exam");
      }
      showMessage("Exam deleted successfully!", "success");
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setExamToDelete(null);
    }
  };

  const currentGroups = userRole === "admin" ? allGroups : teacherGroups;
  const showAddExamButton = userRole === "admin" || (userRole === "teacher" && teacherGroups.length > 0);
  const addExamButtonTitle = userRole === "admin"
    ? "Create new exam"
    : teacherGroups.length === 0
      ? "You must have a group to create an exam"
      : "Create new exam";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <div className="max-w-6xl mx-auto space-y-4">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {userRole === "admin" || userRole === "study_office" ? "Exam Management" : "My Exams"}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              {userRole === "admin" || userRole === "study_office"
                ? "Manage all exams across the school"
                : "View and manage your assigned exams"}
            </p>
          </div>
          {showAddExamButton && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow hover:shadow-md transform hover:scale-105 transition-all duration-200"
              disabled={userRole === "teacher" && teacherGroups.length === 0}
              title={addExamButtonTitle}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Exam
              </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">
                  {exams.length}
                </p>
                <p className="text-slate-600 text-xs">Total Exams</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">
                  {currentGroups.length}
                </p>
                <p className="text-slate-600 text-xs">Total Groups</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-slate-600 text-xs">Today's Date</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white p-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {userRole === "admin" || userRole === "study_office" ? "All Exams" : "My Exams"}
            </h2>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" color="blue" />
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-1">
                  No Exams Yet
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  {userRole === "admin" || userRole === "study_office"
                    ? "Create your first exam to get started."
                    : "You haven't created any exams yet."}
                </p>
                {showAddExamButton && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    Create New Exam
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onNavigate={() =>
                    router.push(
                      userRole === "admin" || userRole === "study_office"
                        ? `/${userRole === "admin" ? "admin" : "study-office"}/exam-management/${exam.id}`
                        : `/teacher/exam/${exam.id}`
                    )
                  }
                  onEdit={() => handleEdit(exam)}
                  onDelete={() => handleDelete(exam.id)}
                  showActions={
                    userRole === "admin" ||
                    (userRole === "teacher" && exam.teacherId === teacherId)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddExamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveExam}
        teacherGroups={currentGroups}
        isLoading={isLoading}
        teacherId={userRole === "teacher" ? teacherId : undefined}
      />

      {examToEdit && (
        <EditExamModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setExamToEdit(null);
          }}
          onSave={handleUpdateExam}
          exam={examToEdit}
          isLoading={isLoading}
        />
      )}

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDelete}
        title="Delete Exam"
        message="Are you sure you want to delete this exam? This will also remove all student submissions. This action cannot be undone."
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
