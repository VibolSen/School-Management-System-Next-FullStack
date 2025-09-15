'use client';

import React, { useState } from 'react';
import QRCodeScanner from '@/components/QRCodeScanner';

const QR_CODE_VALIDITY_MS = 120 * 1000; // 2 minutes

const ScanView = () => {
  const [scanStatus, setScanStatus] = useState('scanning'); // 'scanning' | 'success' | 'error' | 'info'
  const [scanMessage, setScanMessage] = useState('Point your camera at a QR code to mark your attendance.');
  const [showScanner, setShowScanner] = useState(true);

  const handleScan = (data) => {
    setShowScanner(false);
    try {
      const { courseId, timestamp } = JSON.parse(data);

      if (!courseId || typeof timestamp !== 'number') {
        throw new Error('Invalid QR code format.');
      }

      if (Date.now() - timestamp > QR_CODE_VALIDITY_MS) {
        setScanStatus('error');
        setScanMessage('This QR code has expired. Please ask for a new one.');
        return;
      }

      // TODO: Integrate your real API calls here
      // Example:
      // 1. Verify course exists
      // 2. Check student enrollment
      // 3. Check if attendance already marked
      // 4. Mark attendance in backend

      setScanStatus('success');
      setScanMessage(`Success! Your attendance for course ${courseId} has been marked.`);
    } catch (error) {
      setScanStatus('error');
      setScanMessage('Failed to read QR code. Please ensure it is valid and try again.');
    }
  };

  const handleError = (error) => {
    console.error(error);
    setShowScanner(false);
    setScanStatus('error');
    if (typeof error === 'string' && error.includes('permission')) {
      setScanMessage('Camera permission denied. Please enable camera access in your browser settings.');
    } else {
      setScanMessage('Could not access camera. Ensure it is not used by another application.');
    }
  };

  const resetScanner = () => {
    setShowScanner(true);
    setScanStatus('scanning');
    setScanMessage('Point your camera at a QR code to mark your attendance.');
  };

  const getStatusStyles = () => {
    switch (scanStatus) {
      case 'success': return { bg: 'bg-green-100', text: 'text-green-800', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'error': return { bg: 'bg-red-100', text: 'text-red-800', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'info': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-800', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5' };
    }
  };
  const { bg, text, icon } = getStatusStyles();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Scan Attendance QR Code</h1>

      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
        {showScanner ? (
          <QRCodeScanner onScan={handleScan} onError={handleError} />
        ) : (
          <div className="w-full max-w-md text-center flex flex-col items-center justify-center min-h-[300px]">
            <svg className={`w-16 h-16 ${text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
            </svg>
            <h2 className={`mt-4 text-xl font-bold ${text}`}>
                {scanStatus.charAt(0).toUpperCase() + scanStatus.slice(1)}
            </h2>
            <button
                onClick={resetScanner}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
                Scan Again
            </button>
          </div>
        )}

        <div className={`mt-6 p-4 rounded-md w-full max-w-md text-center ${bg} ${text} font-semibold`}>
          {scanMessage}
        </div>
      </div>
    </div>
  );
};

export default ScanView;
