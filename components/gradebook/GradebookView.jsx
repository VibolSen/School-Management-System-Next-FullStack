// components/gradebook/GradebookView.jsx
'use client';

import React, { useState, useEffect } from 'react';
import GradebookToolbar from './GradebookToolbar';
import GradebookTable from './GradebookTable';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

const GradebookView = () => {
  const [gradebookData, setGradebookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-500 h-8 w-8" />
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
        <GradebookToolbar courses={gradebookData.courses} assignments={gradebookData.assignments} exams={gradebookData.exams} />
        <GradebookTable gradebookData={gradebookData} />
      </div>
    </div>
  );
};

export default GradebookView;
