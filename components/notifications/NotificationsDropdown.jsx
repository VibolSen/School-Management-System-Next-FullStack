"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
    // Fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });
      // After marking as read, refetch notifications to get the updated list (which will exclude the read one)
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleNotificationClick = (link) => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className="relative">
      {/* Bell icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 block p-2 text-blue-600 border border-transparent rounded-md focus:outline-none"
      >
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
        <svg
          className="w-5 h-5 text-blue-600"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM19 17V11C19 7.93 16.36 5.36 13.5 5.07V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V5.07C7.64 5.36 5 7.93 5 11V17L3 19V20H21V19L19 17Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-20 w-72 mt-2 overflow-hidden bg-gray-100 text-black rounded-lg shadow-xl border border-gray-200">
          <div className="py-2 max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="px-4 py-2 text-sm text-gray-600">Loading...</div>
            )}
            {error && (
              <div className="px-4 py-2 text-sm text-red-600">{error}</div>
            )}
            {!isLoading && !error && notifications.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-700">
                No new notifications.
              </div>
            )}
            {!isLoading &&
              !error &&
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-center px-4 py-3 -mx-2 border-b border-gray-200 transition-colors ${
                    !notif.isRead ? "bg-gray-50" : ""
                  }`}
                >
                  {!notif.isRead && (
                    <span className="w-2 h-2 mx-1 bg-blue-500 rounded-full"></span>
                  )}
                  <div className="mx-2">
                    <p
                      className={`text-sm font-semibold ${
                        !notif.isRead ? "text-blue-700" : "text-black"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the parent div's onClick from firing
                        handleMarkAsRead(notif.id);
                      }}
                      className="ml-auto text-xs text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
          </div>

          <Link
            href="/student/notifications"
            className="block py-2 font-bold text-center text-black bg-gray-200 hover:bg-gray-300"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
