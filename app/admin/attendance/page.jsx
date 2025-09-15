// app/admin/attendance/page.jsx
"use client"; // <--- Add this directive at the very top

import React, { useState, useEffect } from "react";
import AttendanceView from "@/components/attendance/AttendanceView";

export default function AttendancePage() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setLoggedInUser(data.user);
        } else {
          console.warn("User data not found or invalid with provided token.");
          setLoggedInUser(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoggedInUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-slate-600">
        Loading user data...
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        You are not logged in or authorized to view this page. Please log in.
      </div>
    );
  }

  return <AttendanceView loggedInUser={loggedInUser} />;
}
