"use client";

import React, { useState, useEffect, useCallback } from "react";
import Notification from "@/components/Notification";
import { useUser } from "@/context/UserContext";

export default function HRManageAttendancePage() {
  const { user: currentUser } = useUser();
  const [staffUsers, setStaffUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState({}); // {userId: {status: 'PRESENT', date: '...'}}
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchStaffUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users?roleType=nonStudent"); // New API filter
      if (!response.ok) {
        throw new Error("Failed to fetch staff users.");
      }
      const data = await response.json();
      setStaffUsers(data);
    } catch (error) {
      console.error("Error fetching staff users:", error);
      showMessage(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAttendanceForDate = useCallback(async () => {
    if (!selectedDate || staffUsers.length === 0) return;

    setIsLoading(true);
    try {
      const userIds = staffUsers.map((u) => u.id);
      const response = await fetch("/api/attendance/bulk", {
        // New bulk attendance API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, date: selectedDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch attendance records.");
      }
      const data = await response.json();
      setAttendanceRecords(data); // {userId: {status, date}}
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      showMessage(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, staffUsers]);

  useEffect(() => {
    fetchStaffUsers();
  }, [fetchStaffUsers]);

  useEffect(() => {
    fetchAttendanceForDate();
  }, [fetchAttendanceForDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleManualAttendanceChange = async (userId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/attendance/manual", {
        // New manual attendance API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: selectedDate,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update attendance.");
      }

      // Update local state
      setAttendanceRecords((prev) => ({
        ...prev,
        [userId]: { status: newStatus, date: new Date().toISOString() },
      }));
      showMessage("Attendance updated successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      showMessage(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-3xl font-bold text-slate-800">Manage Staff Attendance</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="attendanceDate" className="block text-sm font-medium text-slate-700 mb-1">
            Select Date:
          </label>
          <input
            type="date"
            id="attendanceDate"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            max={new Date().toISOString().split("T")[0]} // Cannot select future dates
          />
        </div>

        {isLoading ? (
          <p>Loading staff attendance...</p>
        ) : staffUsers.length === 0 ? (
          <p>No staff users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Staff Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check In Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check Out Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffUsers.map((staff) => {
                  const record = attendanceRecords[staff.id];
                  const status = record?.status || "N/A";
                  return (
                    <tr key={staff.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {staff.firstName} {staff.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staff.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staff.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record?.checkInTime ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(record.checkInTime)) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record?.checkOutTime ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(record.checkOutTime)) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            status === "PRESENT"
                              ? "bg-green-100 text-green-800"
                              : status === "ABSENT"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={status === "N/A" ? "" : status}
                          onChange={(e) =>
                            handleManualAttendanceChange(staff.id, e.target.value)
                          }
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          disabled={isLoading}
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                          <option value="LATE">Late</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
