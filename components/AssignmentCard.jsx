"use client";

import React from "react";
import Link from "next/link";
import { FileText, Users, Calendar, CheckCircle } from "lucide-react"; // Import icons

export default function AssignmentCard({ assignment, onNavigate, onDelete }) {
  const { title, group, dueDate, _count, totalStudents } = assignment;

  // Format the due date for display
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    // The `group` class allows us to show actions on hover (see below)
    <div className="group relative bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200">
      {/* Main 4-column grid */}
      <div
        className="grid grid-cols-2 gap-y-4 md:grid-cols-4 md:gap-y-0 cursor-pointer"
        onClick={onNavigate}
      >
        {/* Column 1: Title */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-blue-100 p-2.5 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              TITLE
            </p>
            <p
              className="text-base font-bold text-slate-800 truncate"
              title={title}
            >
              {title}
            </p>
          </div>
        </div>

        {/* Column 2: Group */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-green-100 p-2.5 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              GROUP
            </p>
            <p
              className="text-base font-bold text-slate-800 truncate"
              title={group.name}
            >
              {group.name}
            </p>
          </div>
        </div>

        {/* Column 3: Due Date */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-amber-100 p-2.5 rounded-lg">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              DUE DATE
            </p>
            <p className="text-base font-bold text-slate-800">
              {formattedDueDate}
            </p>
          </div>
        </div>

        {/* Column 4: Submissions */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-indigo-100 p-2.5 rounded-lg">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              SUBMISSIONS
            </p>
            <p className="text-base font-bold text-slate-800">
              {_count.submissions} / {totalStudents}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Actions: Edit & Delete buttons that appear on hover */}
      <div className="absolute top-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link
          href={`/teacher/assignments/${assignment.id}/edit`}
          className="p-1.5 bg-slate-100 hover:bg-blue-200 rounded-md"
          title="Edit Assignment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
            />
          </svg>
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the main card's onClick from firing
            onDelete();
          }}
          className="p-1.5 bg-slate-100 hover:bg-red-200 rounded-md"
          title="Delete Assignment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
