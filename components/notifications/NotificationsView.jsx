"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Notification from "@/components/Notification"; // Reusing existing Notification component for messages

export default function NotificationsView({ loggedInUser }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });

  const showMessage = useCallback((text, type = "success") => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: "", type: "" }), 3000);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Failed to mark notification as read");
      }
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      showMessage("Notification marked as read", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  }, [showMessage]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.isRead);
      await Promise.all(unreadNotifications.map(notif =>
        fetch(`/api/notifications/${notif.id}/read`, { method: "PUT" })
      ));
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      showMessage("All notifications marked as read", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  }, [notifications, showMessage]);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="p-6">
      <Notification {...message} onClose={() => setMessage({ ...message, show: false })} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-lg shadow-md p-4 flex items-center justify-between ${
                !notif.isRead ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex-1">
                <p className={`font-semibold ${!notif.isRead ? "text-blue-700" : "text-gray-800"}`}>
                  {notif.message}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {notif.link && (
                  <Link href={notif.link} className="text-blue-500 hover:underline">
                    View
                  </Link>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
