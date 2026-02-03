"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import ExamCard from "./ExamCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Users, Calendar, Plus, RefreshCcw } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Examination Board
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Oversee academic assessments, manage examination schedules, and coordinate faculty grading boards.
          </p>
        </div>
        {showAddExamButton && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            disabled={userRole === "teacher" && teacherGroups.length === 0}
            title={addExamButtonTitle}
          >
            Schedule Assessment
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{exams.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Exams</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">{currentGroups.length}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Groups</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Date Today</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Examination Roll</h2>
          </div>
          <button
            onClick={fetchData}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Refresh Feed"
          >
            <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
              <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Datasets...</span>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Exams Found</h3>
              <p className="text-slate-500 text-xs mt-1">The examination board is currently clear.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {exams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.4) }}
                >
                  <ExamCard
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
                </motion.div>
              ))}
            </motion.div>
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
