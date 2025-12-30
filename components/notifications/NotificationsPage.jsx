"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

const NotificationsPage = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>You have no notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg shadow ${
                notification.isRead ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
