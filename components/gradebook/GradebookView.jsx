// components/gradebook/GradebookView.jsx
'use client';

import React, { useState, useEffect } from 'react';
import GradebookToolbar from './GradebookToolbar';
import GradebookTable from './GradebookTable';

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gradebook</h1>
      <GradebookToolbar courses={gradebookData.courses} assignments={gradebookData.assignments} exams={gradebookData.exams} />
      <GradebookTable gradebookData={gradebookData} />
    </div>
  );
};

export default GradebookView;
