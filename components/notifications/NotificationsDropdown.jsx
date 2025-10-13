"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(notif => !notif.isRead).length;

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/notifications');
            if (!res.ok) {
                throw new Error('Failed to fetch notifications');
            }
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
        // Fetch notifications initially and then every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isOpen]);

    const handleNotificationClick = async (notificationId, link) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' });
            // Optimistically update the UI
            setNotifications(prev => prev.map(notif =>
                notif.id === notificationId ? { ...notif, isRead: true } : notif
            ));
            // Navigate to the link if available
            if (link) {
                window.location.href = link;
            }
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative z-10 block p-2 text-gray-700 bg-white border border-transparent rounded-md dark:text-white focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:bg-gray-800 focus:outline-none">
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM19 17V11C19 7.93 16.36 5.36 13.5 5.07V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V5.07C7.64 5.36 5 7.93 5 11V17L3 19V20H21V19L19 17Z" fill="currentColor"></path>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 z-20 w-64 mt-2 overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
                    <div className="py-2">
                        {isLoading && <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Loading...</div>}
                        {error && <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
                        {!isLoading && !error && notifications.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">No new notifications.</div>
                        )}
                        {!isLoading && !error && notifications.map(notif => (
                            <div key={notif.id} onClick={() => handleNotificationClick(notif.id, notif.link)} className="flex items-center px-4 py-3 -mx-2 transition-colors duration-200 transform border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer">
                                {!notif.isRead && <span className="w-2 h-2 mx-1 bg-blue-500 rounded-full"></span>}
                                <div className="mx-2">
                                    <p className={`text-sm font-semibold ${!notif.isRead ? "text-blue-700" : "text-gray-800"} dark:text-white`}>{notif.message}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/student/notifications" className="block py-2 font-bold text-center text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600">See all notifications</Link>
                </div>
            )}
        </div>
    );
}
