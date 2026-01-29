"use client";

import React, { useState } from "react";
import Link from "next/link";


const TeacherAssignmentDetailView = ({ assignment }) => {


  if (!assignment) {
    return <p className="text-center py-10">Assignment not found.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            {assignment.title}
          </h1>
          <p className="text-slate-600 mt-1">
            Course: {assignment.course?.title}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Due Date:{" "}
            {assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleString()
              : "N/A"}
          </p>
          <p className="text-sm text-slate-500">
            Group: {assignment.group?.name}
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Description</h2>
          <p className="text-slate-600 whitespace-pre-wrap">
            {assignment.description || "No description provided."}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Student Submissions
          </h2>
          {assignment.submissions && assignment.submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Student Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Grade
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Submitted On
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.submissions.map((submission) => (
                    <tr key={submission.id} className="border-b last:border-b-0 hover:bg-slate-50">
                      <td className="p-4 text-sm text-slate-700">
                        {submission.student.firstName}{" "}
                        {submission.student.lastName}
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            submission.status.name === "GRADED"
                              ? "bg-green-100 text-green-800"
                              : submission.status.name === "SUBMITTED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {submission.status.name}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        {submission.grade ?? "N/A"}
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        <Link
                          href={`/teacher/submissions/${submission.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Submission
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500">No submissions yet for this assignment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentDetailView;
