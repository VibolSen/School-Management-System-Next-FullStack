"use client";

import React, { useState, useMemo } from "react";

export default function ManageGroupMembers({
  initialGroup,
  allStudents,
  onSaveChanges,
  isLoading,
}) {
  const [enrolledStudentIds, setEnrolledStudentIds] = useState(
    initialGroup.students.map((s) => s.id)
  );

  const { enrolledStudents, availableStudents } = useMemo(() => {
    const enrolled = [];
    const available = [];
    const enrolledSet = new Set(enrolledStudentIds);

    allStudents.forEach((student) => {
      if (enrolledSet.has(student.id)) {
        enrolled.push(student);
      } else {
        available.push(student);
      }
    });
    return { enrolledStudents: enrolled, availableStudents: available };
  }, [allStudents, enrolledStudentIds]);

  const handleAddStudent = (studentId) => {
    setEnrolledStudentIds((prev) => [...prev, studentId]);
  };

  const handleRemoveStudent = (studentId) => {
    setEnrolledStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const handleSave = () => {
    onSaveChanges(enrolledStudentIds);
  };

  const StudentListItem = ({ student, onAction, actionLabel }) => (
    <div className="flex justify-between items-center p-2 border-b hover:bg-slate-50">
      <div>
        <p className="font-medium text-slate-800">{`${student.firstName} ${student.lastName}`}</p>
        <p className="text-xs text-slate-500">{student.email}</p>
      </div>
      <button
        onClick={() => onAction(student.id)}
        className="text-sm text-blue-600 hover:underline"
      >
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Enrolled Students ({enrolledStudents.length})
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {enrolledStudents.length > 0 ? (
              enrolledStudents.map((student) => (
                <StudentListItem
                  key={student.id}
                  student={student}
                  onAction={handleRemoveStudent}
                  actionLabel="Remove"
                />
              ))
            ) : (
              <p className="text-center text-slate-500 py-4">
                No students enrolled.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Available Students ({availableStudents.length})
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {availableStudents.map((student) => (
              <StudentListItem
                key={student.id}
                student={student}
                onAction={handleAddStudent}
                actionLabel="Add"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
