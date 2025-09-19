
'use client';

import React, { useState } from 'react';
import QRCodeScanner from '@/components/QRCodeScanner';
import { useUser } from '@/context/UserContext'; // Assuming you have a UserContext to get the logged-in user

export default function ScanStaffAttendancePage() {
  const { user } = useUser();
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (result) => {
    if (result) {
      try {
        const { sessionId } = JSON.parse(result.text);
        const res = await fetch('/api/staff-attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, userId: user.id }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to record attendance.');
        }

        const data = await res.json();
        setScanResult(`Attendance recorded successfully at ${new Date(data.checkIn).toLocaleTimeString()}`);
        setError(null);
      } catch (err) {
        setError(err.message);
        setScanResult(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Scan Staff Attendance</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <QRCodeScanner onScan={handleScan} />
          {error && <p className="text-red-500">{error}</p>}
          {scanResult && <p className="text-green-500">{scanResult}</p>}
        </div>
      </div>
    </div>
  );
}
