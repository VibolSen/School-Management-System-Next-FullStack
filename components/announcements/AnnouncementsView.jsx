"use client";

import React, { useState, useEffect, useCallback } from "react";
import AnnouncementModal from "./AnnouncementModal";
import AnnouncementCard from "./AnnouncementCard";
import Notification from "@/components/Notification";

export default function AnnouncementsView({ courseId, loggedInUser }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showMessage = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/announcements`);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      setAnnouncements(await res.json());
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, showMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (formData) => {
    const url = announcementToEdit
      ? `/api/announcements/${announcementToEdit.id}`
      : `/api/courses/${courseId}/announcements`;
    const method = announcementToEdit ? "PUT" : "POST";

    setIsLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed to save announcement`);
      }
      showMessage(`Announcement ${announcementToEdit ? "updated" : "created"} successfully!`);
      setIsModalOpen(false);
      setAnnouncementToEdit(null);
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setAnnouncementToEdit(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/announcements/${announcementToDelete}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete announcement");
      }
      showMessage("Announcement deleted successfully!");
      await fetchData();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setAnnouncementToDelete(null);
    }
  };
  
  const canCreate = loggedInUser?.role === 'ADMIN' || loggedInUser?.role === 'FACULTY';

  return (
    <div className="p-6">
      <Notification {...notification} onClose={() => setNotification({ ...notification, show: false })} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Announcements</h1>
        {canCreate && (
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            New Announcement
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onEdit={() => handleEdit(ann)}
              onDelete={() => handleDelete(ann.id)}
              currentUser={loggedInUser}
            />
          ))}
        </div>
      )}

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAnnouncementToEdit(null);
        }}
        onSave={handleSave}
        isLoading={isLoading}
        announcement={announcementToEdit}
      />

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Delete Announcement</h2>
            <p>Are you sure you want to delete this announcement?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setShowConfirmation(false)} disabled={isLoading} className="px-4 py-2 bg-gray-200 rounded-md">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-md">
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
