// FILE: components/exam/ExamCard.jsx

"use client";

import React from "react";
import Link from "next/link"; // Assuming Link is needed for navigation

const ExamCard = ({ exam, onNavigate, status, showActions = false }) => {
  // Function to determine the color of the status badge
  const getStatusBadgeStyle = (statusName) => {
    switch (statusName) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "GRADED":
        return "bg-green-100 text-green-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-5 border border-slate-100 flex flex-col justify-between"
    >
      <div onClick={onNavigate} className="cursor-pointer">
        {/* Group Name */}
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
          {exam.group?.name || "No Group"}
        </p>

        {/* Exam Title */}
        <h3 className="text-lg font-bold text-slate-800 leading-tight">
          {exam.title || "Untitled Exam"}
        </h3>
      </div>

      <div className="mt-4">
        {/* Exam Date */}
        <p className="text-sm text-slate-500 mb-3">
          <strong>Date:</strong>{" "}
          {exam.examDate
            ? new Date(exam.examDate).toLocaleDateString()
            : "No date"}
        </p>

        {/* Status Badge */}
        <div
          className={`text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full ${getStatusBadgeStyle(
            status
          )}`}
        >
          {status || "No Status"}
        </div>
      </div>

      {showActions && (
        <div className="mt-4 flex justify-end gap-2">
          {/* Add any exam-specific actions here if needed */}
        </div>
      )}
    </div>
  );
};

export default ExamCard;