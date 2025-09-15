// FILE: ExamDetailView.jsx
"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import AddExamModal from "./AddExamModal"; // Make sure this path is correct
import Notification from "@/components/Notification";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function ExamManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchExams = async () => {
    try {
      setIsLoading(true); // Show loading indicator
      const res = await fetch("/api/exam");
      if (!res.ok) throw new Error("Failed to fetch exams");
      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setExams([]); // Clear exams on error
      showMessage("Failed to fetch exams", "error");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        setCourses([]);
        showMessage("Failed to fetch courses", "error");
      }
    };

    fetchCourses();
    fetchExams(); // Also fetch exams when the component mounts
  }, []);

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/exam?id=${itemToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchExams();
      setItemToDelete(null);
      showMessage("Exam deleted successfully!");
    } catch (err) {
      console.error(err);
      showMessage('Failed to delete exam.', "error");
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Head>
        <title>Exam Management</title>
      </Head>

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {/* Header section (no changes here) */}
      <div className="flex justify-between items-center mb-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Exam Management</h1>
          <p className="text-gray-600">
            Create, schedule, and grade exams for your courses.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
        >
          Create Exam
        </button>
      </div>

      {/* --- DYNAMIC EXAM LIST: This whole section is updated --- */}
      <div className="bg-white rounded-lg shadow-md p-6 mx-4 sm:mx-6 lg:mx-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Scheduled Exams
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Loading exams...</p>
        ) : exams.length > 0 ? (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-4"
              >
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {exam.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Course:{" "}
                    <span className="font-semibold">
                      {exam.course?.title || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(exam.startDate).toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <button className="text-blue-600 hover:underline text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteRequest(exam.id)} className="text-red-600 hover:underline text-sm font-medium ml-4">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No exams have been scheduled yet.
          </p>
        )}
      </div>

      {/* --- UPDATED MODAL: Pass a callback function to refresh the list --- */}
      <AddExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={courses}
        onExamAdded={() => {
          fetchExams();
          showMessage("Exam added successfully!");
        }}
      />

      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Exam"
          message="Are you sure you want to delete this exam?"
        />
      )}
    </div>
  );
}
