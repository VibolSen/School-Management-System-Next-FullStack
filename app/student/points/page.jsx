
'use client';

import { useState, useEffect } from 'react';

const StudentPointsPage = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    const res = await fetch('/api/student/points');
    const data = await res.json();
    if (Array.isArray(data)) {
      setPoints(data);
    } else {
      console.error('API returned non-array data:', data);
      setPoints([]); // Ensure points is always an array
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Points</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Reason</th>
            <th className="py-2">Points</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.id}>
              <td className="border px-4 py-2">{point.reason}</td>
              <td className="border px-4 py-2">{point.points}</td>
              <td className="border px-4 py-2">{new Date(point.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPointsPage;
