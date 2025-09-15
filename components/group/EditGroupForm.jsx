"use client";

import React, { useState } from "react";
import StudentSelector from "./StudentSelector";

export default function EditGroupForm({
  group,
  allStudents,
  onSave,
  onCancel,
  isLoading,
}) {
  const [name, setName] = useState(group.name);
  const [studentIds, setStudentIds] = useState(
    group.members.map((m) => m.student.id)
  );
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Group name cannot be empty.");
      return;
    }
    setError("");
    onSave(group.id, { name, studentIds });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Group Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 ${
            error ? "border-red-500" : "border-slate-300"
          }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      <StudentSelector
        allStudents={allStudents}
        selectedStudentIds={studentIds}
        setSelectedStudentIds={setStudentIds}
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
