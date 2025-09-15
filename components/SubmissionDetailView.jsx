import React, { useState, useEffect, useMemo } from "react";

import { SubmissionStatus } from "../types";

const getStatusBadge = (status, grade) => {
  switch (status) {
    case SubmissionStatus.PENDING:
      return (
        <span className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-200 rounded-full">
          Not Submitted
        </span>
      );
    case SubmissionStatus.SUBMITTED:
      return (
        <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
          Submitted
        </span>
      );
    case SubmissionStatus.LATE:
      return (
        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
          Late
        </span>
      );
    case SubmissionStatus.GRADED:
      return (
        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
          Graded: {grade}%
        </span>
      );
    default:
      return null;
  }
};

const SubmissionDetailView = ({ assignment, course, onBack, onEdit }) => {
  const [submissions, setSubmissions] = useState([]);
  const [courseStudents, setCourseStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ removed TS type

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionsResponse, studentsResponse] = await Promise.all([
          fetch(`/api/submissions?assignmentId=${assignment.id}`),
          fetch(`/api/students?courseId=${course.id}`),
        ]);

        if (!submissionsResponse.ok) {
          throw new Error("Failed to fetch submissions");
        }
        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch students");
        }

        const submissionsData = await submissionsResponse.json();
        const studentsData = await studentsResponse.json();

        setSubmissions(submissionsData);
        setCourseStudents(studentsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignment.id, course.id]);

  const submissionDetails = useMemo(() => {
    const details = courseStudents
      .map((student) => {
        const submission = submissions.find(
          (s) => s.assignmentId === assignment.id && s.studentId === student.id
        );
        if (submission) {
          return { studentName: student.name, ...submission };
        }
        return {
          id: `placeholder-${student.id}`,
          assignmentId: assignment.id,
          studentId: student.id,
          submissionDate: null,
          status: SubmissionStatus.PENDING,
          grade: null,
          studentName: student.name,
        };
      })
      .sort((a, b) => a.studentName.localeCompare(b.studentName));

    if (statusFilter === "All") {
      return details;
    }
    return details.filter((sub) => sub.status === statusFilter);
  }, [assignment.id, courseStudents, submissions, statusFilter]);

  const handleGradeClick = (sub) => {
    setEditingGrade({ submissionId: sub.id, studentId: sub.studentId });
    setGradeValue(sub.grade?.toString() || "");
  };

  const handleGradeChange = (e) => {
    setGradeValue(e.target.value); // ✅ removed TS event type
  };

  const handleSaveGrade = async (submissionId, studentId) => {
    const grade = parseInt(gradeValue, 10);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      alert("Please enter a valid grade between 0 and 100.");
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, status: SubmissionStatus.GRADED }),
      });

      if (!response.ok) {
        throw new Error("Failed to save grade");
      }

      const updatedSubmission = await response.json();

      const updatedSubmissions = submissions.map((s) =>
        s.id === updatedSubmission.id ? updatedSubmission : s
      );
      setSubmissions(updatedSubmissions);
      setEditingGrade(null);
      setGradeValue("");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingGrade(null);
    setGradeValue("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center text-sm font-semibold text-blue-600 hover:underline"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Back to Assignments
      </button>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="border-b border-slate-200 pb-4 mb-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {assignment.title}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {course.name} &bull; Due:{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onEdit(assignment)}
              className="flex-shrink-0 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-50 transition"
            >
              Edit Assignment
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            Description & Instructions
          </h2>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
            {assignment.description ||
              "No description was provided for this assignment."}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Submissions ({submissionDetails.length})
          </h2>
          <div>
            <label
              htmlFor="submission-status-filter"
              className="text-sm font-medium text-slate-700 mr-2"
            >
              Filter by:
            </label>
            <select
              id="submission-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value={SubmissionStatus.PENDING}>Not Submitted</option>
              <option value={SubmissionStatus.SUBMITTED}>Submitted</option>
              <option value={SubmissionStatus.LATE}>Late</option>
              <option value={SubmissionStatus.GRADED}>Graded</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {submissionDetails.length > 0 ? (
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Submission Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Grade
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissionDetails.map((sub) => (
                  <tr
                    key={sub.id}
                    className="bg-white border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {sub.studentName}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        sub.status === SubmissionStatus.LATE
                          ? "text-yellow-700 font-medium"
                          : ""
                      }`}
                    >
                      {sub.submissionDate
                        ? new Date(sub.submissionDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sub.status, sub.grade)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingGrade?.submissionId === sub.id ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gradeValue}
                          onChange={handleGradeChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveGrade(sub.id, sub.studentId);
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                          className="w-20 px-2 py-1 border border-slate-300 rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : sub.grade !== null ? (
                        `${sub.grade}%`
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingGrade?.submissionId === sub.id ? (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() =>
                              handleSaveGrade(sub.id, sub.studentId)
                            }
                            className="font-medium text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="font-medium text-slate-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGradeClick(sub)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {sub.grade !== null ? "Edit Grade" : "Grade"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>No submissions match the selected filter.</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SubmissionDetailView;
