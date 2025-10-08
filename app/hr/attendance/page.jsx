"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Notification from "@/components/Notification";

export default function HRAttendancePage() {
  const { user } = useUser();
  const [attendanceStatus, setAttendanceStatus] = useState(null); // 'CHECK_IN', 'CHECK_OUT', or null
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const fetchAttendanceStatus = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/attendance?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendance status.");
      }
      const data = await response.json();
      // Assuming the API returns the last action for the day
      if (data && data.status) {
        setAttendanceStatus(data.status);
      } else {
        setAttendanceStatus(null); // No attendance recorded for today
      }
    } catch (error) {
      console.error("Error fetching attendance status:", error);
      showMessage(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [user]);

  const handleAction = async (actionType) => {
    if (!user) {
      showMessage("User not logged in.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: actionType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${actionType}.`);
      }

      showMessage(`Successfully ${actionType.replace("_", " ").toLowerCase()}!`);
      setAttendanceStatus(actionType);
    } catch (error) {
      console.error(`Error during ${actionType}:`, error);
      showMessage(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const isCheckedIn = attendanceStatus === "CHECK_IN";
  const isCheckedOut = attendanceStatus === "CHECK_OUT";

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-3xl font-bold text-slate-800">Staff Attendance</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg text-slate-700 mb-4">
          Welcome, {user?.firstName} {user?.lastName}!
        </p>
        <p className="text-md text-slate-600 mb-6">
          Current Status:{" "}
          <span
            className={`font-semibold ${
              isCheckedIn
                ? "text-green-600"
                : isCheckedOut
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {isCheckedIn
              ? "Checked In"
              : isCheckedOut
              ? "Checked Out"
              : "No action recorded today"}
          </span>
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => handleAction("CHECK_IN")}
            disabled={isLoading || isCheckedIn}
            className={`px-6 py-3 rounded-md text-white font-semibold transition-colors ${
              isLoading || isCheckedIn
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading && attendanceStatus !== "CHECK_IN" ? "Checking In..." : "Check In"}
          </button>
          <button
            onClick={() => handleAction("CHECK_OUT")}
            disabled={isLoading || !isCheckedIn || isCheckedOut}
            className={`px-6 py-3 rounded-md text-white font-semibold transition-colors ${
              isLoading || !isCheckedIn || isCheckedOut
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading && attendanceStatus === "CHECK_IN" ? "Checking Out..." : "Check Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
