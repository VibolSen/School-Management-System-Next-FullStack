
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const QRCode = dynamic(() => import('qrcode.react'), { ssr: false });

export default function StaffAttendanceQRPage() {
  const [qrCodeValue, setQrCodeValue] = useState(null);
  const [error, setError] = useState(null);

  const generateQrCode = async () => {
    try {
      const res = await fetch('/api/admin/staff-attendance/session', {
        method: 'POST',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate QR code.');
      }

      const session = await res.json();
      setQrCodeValue(JSON.stringify({ sessionId: session.id }));
      setError(null);
    } catch (err) {
      setError(err.message);
      setQrCodeValue(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Staff Attendance QR Code</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={generateQrCode}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            Generate QR Code for Today
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {qrCodeValue && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <QRCode value={qrCodeValue} size={256} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
