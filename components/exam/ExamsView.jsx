"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AddExamModal from "./AddExamModal";
import Notification from "@/components/Notification";

export default function ExamsView({ loggedInUser }) {
  const [exams, setExams] = useState([]);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

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
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
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
          onClick={() => setIsModalOpen(true)}
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

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          My Exams List
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading exams...</p>
          ) : exams.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              You have not created any exams yet.
            </p>
          ) : (
            exams.map((exam) => (
              <Link
                key={exam.id}
                href={`/teacher/exam/${exam.id}`}
                className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {exam.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      Assigned to:{" "}
                      <span className="font-medium">
                        {exam.group.name}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      Submissions:
                      <span className="font-bold text-slate-700">
                        {" "}
                        {exam._count.submissions} /{" "}
                        {exam.totalStudents}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Date:{" "}
                      {exam.examDate
                        ? new Date(exam.examDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <AddExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExam}
        teacherGroups={teacherGroups}
        isLoading={isLoading}
      />
    </div>
  );
}
