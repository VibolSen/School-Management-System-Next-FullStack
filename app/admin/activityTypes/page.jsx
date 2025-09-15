"use client";

import React, { useEffect, useState } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

const ActivityTypes = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/activity");
      if (!res.ok) throw new Error("Failed to fetch activity types");
      const data = await res.json();
      setTypes(data);
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newType.trim()) return;

    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newType }),
      });
      if (!res.ok) throw new Error("Failed to add activity type");
      const data = await res.json();
      setTypes((prev) => [...prev, data]);
      setNewType("");
      showMessage("Activity type added successfully!");
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
    }
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/activity?id=${itemToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setTypes((prev) => prev.filter((t) => t.id !== itemToDelete));
      setItemToDelete(null);
      showMessage("Activity type deleted successfully!");
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-2xl font-bold mb-4">Activity Types</h1>

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New Activity Type"
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {types.length === 0 ? (
        <p>No activity types found.</p>
      ) : (
        <table className="min-w-full border bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.id} className="text-center">
                <td className="border px-4 py-2">{t.name}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteRequest(t.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Activity Type"
          message="Are you sure you want to delete this type?"
        />
      )}
    </div>
  );
};

export default ActivityTypes;