'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacultyPage() {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchFaculty() {
        try {
          const res = await fetch(`/api/faculties/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch faculty');
          }
          const data = await res.json();
          setFaculty(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchFaculty();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!faculty) {
    return <div>Faculty not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">{faculty.name}</h1>
      {faculty.head && (
        <p className="text-lg mb-4">
          <strong>Head of Faculty:</strong> {faculty.head.firstName} {faculty.head.lastName}
        </p>
      )}
      <h2 className="text-2xl font-bold mb-2">Departments</h2>
      {faculty.departments.length > 0 ? (
        <ul>
          {faculty.departments.map((dept) => (
            <li key={dept.id} className="mb-2">
              {dept.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No departments found for this faculty.</p>
      )}
    </div>
  );
}