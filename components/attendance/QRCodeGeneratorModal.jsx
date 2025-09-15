"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

const QR_CODE_EXPIRATION_SECONDS = 120; // 2 minutes

const QRCodeGeneratorModal = ({
  isOpen,
  onClose,
  course,
  checkedInStudents,
  totalStudents,
  currentUserId,
  onQrSessionCreated,
  activeQrSessionId,
  setLiveCheckedInStudents,
}) => {
  const canvasRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(QR_CODE_EXPIRATION_SECONDS);
  const [qrCodeSession, setQrCodeSession] = useState(null);
  const intervalRef = useRef(null);

  const generateRandomQrCodeString = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // -------------------------
  // Create QR Code Session
  // -------------------------
  useEffect(() => {
    if (!isOpen || !course || !currentUserId || qrCodeSession) return;

    const createQrSession = async () => {
      const qrCodeString = generateRandomQrCodeString();
      const expiresAt = new Date(
        Date.now() + QR_CODE_EXPIRATION_SECONDS * 1000
      ).toISOString();

      const body = {
        courseId: course.id,
        createdById: currentUserId,
        qrCode: qrCodeString,
        expiresAt,
      };

      try {
        const res = await fetch("/api/qrcode-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to create QR code session: ${res.status} ${text}`
          );
        }

        const newSession = await res.json();
        setQrCodeSession(newSession);
        onQrSessionCreated(newSession.id);

        // Generate QR code on canvas using the QR string
        QRCode.toCanvas(
          canvasRef.current,
          qrCodeString,
          { width: 256, errorCorrectionLevel: "H" },
          (err) => {
            if (err) console.error("Error generating QR code:", err);
          }
        );

        setTimeLeft(QR_CODE_EXPIRATION_SECONDS);
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
      } catch (error) {
        console.error("Error creating QR session:", error);
        onClose();
      }
    };

    createQrSession();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setQrCodeSession(null);
      setTimeLeft(QR_CODE_EXPIRATION_SECONDS);
    };
  }, [
    isOpen,
    course,
    currentUserId,
    qrCodeSession,
    onQrSessionCreated,
    onClose,
  ]);

  // -------------------------
  // Poll for live check-ins
  // -------------------------
  useEffect(() => {
    if (!isOpen || !activeQrSessionId || timeLeft <= 0) return;

    const fetchLiveCheckIns = async () => {
      try {
        const res = await fetch(
          `/api/attendances?qrCodeSessionId=${activeQrSessionId}`
        );
        if (!res.ok)
          throw new Error(
            `Failed to fetch live attendances: ${res.statusText}`
          );
        const data = await res.json();

        const presentStudents = data.filter(
          (att) => att.status?.name === "Present"
        );
        const studentIds = presentStudents.map((att) => att.userId); // Corrected field

        const studentDetails = await Promise.all(
          studentIds.map((id) =>
            fetch(`/api/users?id=${id}`).then((r) => r.json())
          )
        );

        setLiveCheckedInStudents(studentDetails.filter((s) => s));
      } catch (error) {
        console.error("Error fetching live check-ins:", error);
      }
    };

    fetchLiveCheckIns();
    const interval = setInterval(fetchLiveCheckIns, 5000);

    return () => clearInterval(interval);
  }, [isOpen, activeQrSessionId, timeLeft, setLiveCheckedInStudents]);

  if (!isOpen || !course) return null;

  const isExpired = timeLeft <= 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Live Attendance</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <p className="font-semibold text-slate-700">{course.title}</p>
          <p className="text-sm text-slate-500 mb-4">
            Students can scan this code to mark their attendance.
          </p>

          <div
            className={`relative inline-block p-4 bg-slate-100 rounded-lg ${
              isExpired || !qrCodeSession ? "opacity-20" : ""
            }`}
          >
            <canvas ref={canvasRef} />
            {(isExpired || !qrCodeSession) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                <span className="px-4 py-2 text-lg font-bold text-white bg-red-600 rounded-md">
                  {isExpired ? "EXPIRED" : "GENERATING..."}
                </span>
              </div>
            )}
          </div>

          <p className="mt-4 text-slate-600">
            {isExpired ? (
              <span className="text-red-600 font-bold text-lg">
                This QR code has expired.
              </span>
            ) : (
              <>
                Code expires in:{" "}
                <span className="font-bold text-blue-600 text-lg">{`${minutes}:${
                  seconds < 10 ? "0" : ""
                }${seconds}`}</span>
              </>
            )}
          </p>

          <div className="mt-6 w-full">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600 mb-1 px-1">
              <span>Checked In</span>
              <span>
                {checkedInStudents.length} / {totalStudents}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width:
                    totalStudents > 0
                      ? (checkedInStudents.length / totalStudents) * 100 + "%"
                      : "0%",
                }}
              ></div>
            </div>

            <div className="mt-3 bg-slate-50 border rounded-lg max-h-36 overflow-y-auto text-left">
              {checkedInStudents.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {checkedInStudents.map((student) => (
                    <li
                      key={student.id}
                      className="px-4 py-2 text-sm text-slate-800"
                    >
                      {student.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                  Waiting for students to check in...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGeneratorModal;
