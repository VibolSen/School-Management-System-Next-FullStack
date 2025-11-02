
'use client';

import { useState, useEffect } from 'react';

const PointsManagementPage = () => {
  const [points, setPoints] = useState([]);
  const [users, setUsers] = useState([]);
  const [reason, setReason] = useState('');
  const [pointsValue, setPointsValue] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchPoints();
    fetchUsers();
  }, []);

  const fetchPoints = async () => {
    const res = await fetch('/api/points');
    const data = await res.json();
    if (Array.isArray(data)) {
      setPoints(data);
    } else {
      console.error('API returned non-array data:', data);
      setPoints([]); // Ensure points is always an array
    }
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      console.error('API returned non-array data for users:', data);
      setUsers([]); // Ensure users is always an array
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: selectedUser, reason, points: pointsValue }),
    });
    fetchPoints();
    setReason('');
    setPointsValue('');
    setSelectedUser('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Points Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center mb-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            placeholder="Points"
            value={pointsValue}
            onChange={(e) => setPointsValue(e.target.value)}
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Points
          </button>
        </div>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">User</th>
            <th className="py-2">Reason</th>
            <th className="py-2">Points</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.id}>
              <td className="border px-4 py-2">{point.user.firstName} {point.user.lastName}</td>
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

export default PointsManagementPage;
