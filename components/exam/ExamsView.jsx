"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";
import Notification from "@/components/Notification";
import ExamCard from "./ExamCard"; 

export default function ExamsView({ loggedInUser }) {
  const [exams, setExams] = useState([]);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const router = useRouter();
  const teacherId = loggedInUser?.id;

  const showMessage = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  }, []);

  const fetchData = useCallback(async () => {
    if (!teacherId) return;
    setIsLoading(true);
    try {
      const [examsRes, groupsRes] = await Promise.all([
        fetch(`/api/teacher/exams?teacherId=${teacherId}`),
        fetch(`/api/teacher/my-groups?teacherId=${teacherId}`),
      ]);
      if (!examsRes.ok) throw new Error("Failed to fetch exams");
      if (!groupsRes.ok) throw new Error("Failed to fetch your groups");
      setExams(await examsRes.json());
      setTeacherGroups(await groupsRes.json());
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, showMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveExam = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/teacher/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, teacherId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create exam");
      }
      showMessage("Exam created successfully!");
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
        `/api/teacher/exams/${examToEdit.id}`,
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
      showMessage("Exam updated successfully!");
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
        `/api/teacher/exams/${examToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete exam");
      }
      showMessage("Exam deleted successfully!");
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setExamToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Exams</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          disabled={teacherGroups.length === 0}
          title={
            teacherGroups.length === 0
              ? "You must have a group to create an exam"
              : "Create new exam"
          }
        >
          Add Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <p className="text-center py-8 text-slate-500">
            Loading exams...
          </p>
        ) : exams.length === 0 ? (
          <div className="col-span-4 text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="font-semibold text-slate-700">No Exams Found</p>
            <p className="text-slate-500 mt-2">
              Click "Add Exam" to get started.
            </p>
          </div>
        ) : (
          exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onNavigate={() =>
                router.push(`/teacher/exam/${exam.id}`)
              }
              onEdit={() => handleEdit(exam)}
              onDelete={() => handleDelete(exam.id)}
              showActions={true}
            />
          ))
        )}
      </div>

      <AddExamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveExam}
        teacherGroups={teacherGroups}
        isLoading={isLoading}
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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800">
                Confirm Deletion
              </h2>
              <p className="text-slate-500 mt-2">
                Are you sure you want to delete this exam? This will also
                remove all student submissions. This action cannot be undone.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-white border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
