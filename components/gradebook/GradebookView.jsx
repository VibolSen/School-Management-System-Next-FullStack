// components/gradebook/GradebookView.jsx
'use client';

import React, { useState, useEffect } from 'react';
import GradebookToolbar from './GradebookToolbar';
import GradebookTable from './GradebookTable';
import { FiAlertTriangle } from 'react-icons/fi';
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const GradebookView = () => {
  const [gradebookData, setGradebookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCourseId, setSelectedCourseId] = useState('ALL');
  const [selectedGroupId, setSelectedGroupId] = useState('ALL');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('ALL');

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);

  useEffect(() => {
    const fetchGradebookData = async () => {
      try {
        const response = await fetch('/api/gradebook');
        if (!response.ok) {
          throw new Error('Failed to fetch gradebook data');
        }
        const data = await response.json();
        setGradebookData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGradebookData();
  }, []);

  useEffect(() => {
    if (!gradebookData) return;

    const { courses, assignments, exams } = gradebookData;
    let students = [];
    
    // 1. Filter Students based on Course and Group
    if (selectedCourseId === 'ALL') {
      students = courses.flatMap(course => course.groups.flatMap(group => group.students));
      setAvailableGroups([]); // Reset groups if ALL courses selected (optional choice, or show all groups)
    } else {
      const course = courses.find(c => c.id === selectedCourseId);
      if (course) {
        setAvailableGroups(course.groups || []);
        if (selectedGroupId === 'ALL') {
           students = course.groups.flatMap(group => group.students);
        } else {
           const group = course.groups.find(g => g.id === selectedGroupId);
           students = group ? group.students : [];
        }
      }
    }

    // Deduplicate students
    const uniqueStudents = Array.from(new Set(students.map(s => s.id)))
    .map(id => students.find(s => s.id === id));
    
    setFilteredStudents(uniqueStudents);

    // 2. Filter Assignments/Exams (Columns)
    const allItems = [...(assignments || []), ...(exams || [])];
    if (selectedAssignmentId === 'ALL') {
      setFilteredAssignments(allItems);
    } else {
      setFilteredAssignments(allItems.filter(item => item.id === selectedAssignmentId));
    }

  }, [gradebookData, selectedCourseId, selectedGroupId, selectedAssignmentId]);

  // Reset group when course changes
  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedGroupId('ALL');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" color="blue" />
        <span className="ml-3 text-gray-600">Loading gradebook...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <FiAlertTriangle className="text-red-500 h-8 w-8" />
        <span className="ml-3 text-red-700 font-medium">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gradebook</h1>
        <p className="text-sm text-gray-500 mb-6">An overview of all student grades and performance.</p>
        <GradebookToolbar 
            courses={gradebookData.courses} 
            assignments={[...(gradebookData.assignments || []), ...(gradebookData.exams || [])]}
            groups={availableGroups}
            selectedCourse={selectedCourseId}
            selectedGroup={selectedGroupId}
            selectedAssignment={selectedAssignmentId}
            onCourseChange={handleCourseChange}
            onGroupChange={setSelectedGroupId}
            onAssignmentChange={setSelectedAssignmentId}
        />
        <GradebookTable 
            students={filteredStudents} 
            assignments={filteredAssignments} 
            gradebookData={gradebookData} // Still needed for lookup of grades
        />
      </div>
    </div>
  );
};

export default GradebookView;
