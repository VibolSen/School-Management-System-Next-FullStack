// FILE: components/assignment/StudentAssignmentModal.jsx

"use client";

import React, { useState, useEffect } from "react";

export default function StudentAssignmentModal({
  isOpen,
  onClose,
  onSave,
  assignmentToEdit,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    departmentId: "",
    courseId: "",
    groupId: "",
    statusId: "",
    grade: "",
    feedback: "",
  });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, statusRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/attendance-status"), // This fetches statuses like "Pending", "Submitted", etc.
        ]);
        setDepartments(await deptRes.json());
        setStatuses(await statusRes.json());
      } catch (error) {
        console.error("Failed to fetch modal data:", error);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (assignmentToEdit) {
      const assignment = assignmentToEdit.assignment || {};
      const course = assignment.course || {};
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().slice(0, 16)
          : "",
        departmentId: course.departmentId || "",
        courseId: assignment.courseId || "",
        groupId: assignmentToEdit.groupAssignment?.group?.id || "",
        statusId: assignmentToEdit.statusId || "",
        grade: assignmentToEdit.grade ?? "",
        feedback: assignmentToEdit.feedback || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        departmentId: "",
        courseId: "",
        groupId: "",
        statusId: "",
        grade: "",
        feedback: "",
      });
    }
  }, [assignmentToEdit, isOpen]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (formData.departmentId) {
        const res = await fetch(
          `/api/courses?departmentId=${formData.departmentId}`
        );
        setCourses(await res.json());
      } else {
        setCourses([]);
      }
    };
    fetchCourses();
  }, [formData.departmentId]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (formData.courseId) {
        const res = await fetch(`/api/groups?courseId=${formData.courseId}`);
        setGroups(await res.json());
      } else {
        setGroups([]);
      }
    };
    fetchGroups();
  }, [formData.courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "departmentId" && { courseId: "", groupId: "" }),
      ...(name === "courseId" && { groupId: "" }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { departmentId, ...payload } = formData;
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              {assignmentToEdit ? "Edit" : "Add"} Assignment
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Assignment Title"
                required
                className="border p-2 rounded w-full"
              />
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description..."
              className="border p-2 rounded w-full"
              rows="3"
            ></textarea>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                disabled={!formData.departmentId}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <select
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                required
                disabled={!formData.courseId || !!assignmentToEdit}
                className="border p-2 rounded w-full"
              >
                <option value="">Assign to Group</option>
                {groups.map((g) => (
                  <option
                    key={g.id}
                    value={g.id}
                    disabled={!g.members || g.members.length === 0}
                  >
                    {g.name} ({g.members?.length || 0} students)
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="statusId"
                value={formData.statusId}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              >
                <option value="">Select Status</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Grade (Optional)"
                className="border p-2 rounded w-full"
              />
              <input
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Feedback (Optional)"
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
