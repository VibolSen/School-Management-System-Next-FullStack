// FILE: components/exam/ExamCard.jsx

"use client";

import React from "react";
import Link from "next/link"; // Assuming Link is needed for navigation

const ExamCard = ({
  exam,
  onNavigate,
  onEdit,
  onDelete,
  status,
  showActions = false,
}) => {
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
    <div className="bg-white shadow-md rounded-lg p-5 border border-slate-100 flex flex-col justify-between transition-transform duration-200 hover:shadow-lg hover:scale-105">
      <div onClick={onNavigate} className="cursor-pointer flex-grow">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
          {exam.group?.name || "No Group"}
        </p>
        <h3 className="text-lg font-bold text-slate-800 leading-tight">
          {exam.title || "Untitled Exam"}
        </h3>
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-500 mb-3">
          <strong>Date:</strong>{" "}
          {exam.examDate
            ? new Date(exam.examDate).toLocaleDateString()
            : "No date"}
        </p>
        {status && (
          <div
            className={`text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full ${getStatusBadgeStyle(
              status
            )}`}
          >
            {status}
          </div>
        )}
      </div>

      {showActions && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 py-1 px-3 rounded-md bg-slate-100 hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-red-600 py-1 px-3 rounded-md bg-slate-100 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamCard;