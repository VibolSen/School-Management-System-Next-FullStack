"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CheckSquare, Square, Search, X } from "lucide-react";

export default function BulkCertificateModal({ isOpen, onClose, onCertificatesIssued, showMessage }) {
  const [step, setStep] = useState(1); // 1: Select Course/Group, 2: Select Students
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Certificate Details
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setStep(1);
    setSelectedCourse("");
    setSelectedGroup("");
    setStudents([]);
    setSelectedStudentIds(new Set());
    setIssueDate(new Date().toISOString().split('T')[0]);
    setExpiryDate("");
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const fetchGroupsForCourse = async (courseId) => {
    // In a real app, you might have an API to get groups for a course
    // For now, we'll fetch all groups and filter client-side or assume an API exists
    // Let's try to fetch all groups first
    try {
      const response = await fetch("/api/groups"); 
      if (response.ok) {
        const data = await response.json();
        // Filter groups that have this course
        const relevantGroups = data.filter(g => g.courseIds.includes(courseId));
        setGroups(relevantGroups);
      }
    } catch (error) {
      console.error("Failed to fetch groups", error);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedGroup("");
    if (courseId) {
      fetchGroupsForCourse(courseId);
    } else {
      setGroups([]);
    }
  };

  const handleNext = async () => {
    if (!selectedCourse) return;
    
    setIsLoading(true);
    try {
      // Fetch students for the selected group (or course if no group selected, dependent on logic)
      // Assuming we need a group to narrow it down effectively
      let url = `/api/users?role=STUDENT`;
      if (selectedGroup) {
        url += `&groupId=${selectedGroup}`;
      } 
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // If retrieving by group, the API might strictly return group members.
        // If retrieving by course only is allowed, we'd need filtering.
        // For simplicity, let's enforce Group selection for now or handle course enrollment.
        
        setStudents(data);
        // Default select all
        setSelectedStudentIds(new Set(data.map(s => s.id)));
        setStep(2);
      }
    } catch (error) {
      showMessage("Failed to fetch students", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStudent = (id) => {
    const newSelected = new Set(selectedStudentIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudentIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedStudentIds.size === students.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(students.map(s => s.id)));
    }
  };

  const handleSubmit = async () => {
    if (selectedStudentIds.size === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        courseId: selectedCourse,
        issueDate,
        expiryDate: expiryDate || null,
        studentIds: Array.from(selectedStudentIds)
      };

      const response = await fetch("/api/certificates/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`Successfully issued ${result.count} certificates!`, "success");
        onCertificatesIssued();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      showMessage(error.message || "Failed to issue certificates", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 1 ? "Bulk Issue Certificates - Select Scope" : "Select Students"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course <span className="text-red-500">*</span></label>
                <select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select a Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Group (Optional but Recommended)</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  disabled={!selectedCourse}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                >
                  <option value="">All Groups in Course</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <p className="text-xs text-slate-500 mt-1">Select a group to narrow down the student list.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                   <input 
                      type="date" 
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (Optional)</label>
                   <input 
                      type="date" 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                   <button onClick={toggleAll} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2">
                     {selectedStudentIds.size === students.length ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                     Select All ({students.length})
                   </button>
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {selectedStudentIds.size} selected
                </span>
              </div>

              {isLoading ? (
                <div className="py-10 flex justify-center"><LoadingSpinner /></div>
              ) : (
                <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
                  {students.map(student => (
                    <div 
                      key={student.id} 
                      onClick={() => toggleStudent(student.id)}
                      className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${selectedStudentIds.has(student.id) ? 'bg-blue-50/50' : ''}`}
                    >
                      {selectedStudentIds.has(student.id) 
                        ? <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" /> 
                        : <Square className="w-5 h-5 text-slate-300 flex-shrink-0" />
                      }
                      <div>
                        <p className="font-medium text-slate-800">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No students found for this selection.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 rounded-b-xl flex justify-between items-center">
            {step === 2 && (
               <button onClick={() => setStep(1)} className="text-slate-600 hover:text-slate-800 text-sm font-semibold px-4 py-2">
                 Back
               </button>
            )}
            <div className="ml-auto flex gap-3">
              <button 
                onClick={onClose} 
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white"
              >
                Cancel
              </button>
              {step === 1 ? (
                <button 
                  onClick={handleNext}
                  disabled={!selectedCourse}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Select Students
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={selectedStudentIds.size === 0 || isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <LoadingSpinner size="sm" color="white" />}
                  Issue {selectedStudentIds.size} Certificates
                </button>
              )}
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
