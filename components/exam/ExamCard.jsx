
"use client";

import React from "react";

const ExamCard = ({ exam, onNavigate, onEdit, onDelete }) => {

  return (
    <div
      className="bg-white shadow-md rounded-lg p-5 border border-slate-100 flex flex-col justify-between"
    >
      <div onClick={onNavigate} className="cursor-pointer">
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
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onEdit} className="text-sm text-blue-600 hover:underline">Edit</button>
        <button onClick={onDelete} className="text-sm text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
};

export default ExamCard;
