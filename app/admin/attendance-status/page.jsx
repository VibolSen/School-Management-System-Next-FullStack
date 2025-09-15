'use client';

import React, { useState, useEffect } from 'react';
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

const API_ROUTE = '/api/attendance-status';

const AttendanceStatusManager = () => {
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusName, setEditingStatusName] = useState('');
  const [loading, setLoading] = useState(false);
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

  // Fetch all statuses
  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ROUTE);
      const data = await res.json();
      setStatuses(data);
    } catch (err) {
      console.error(err);
      showMessage('Failed to fetch statuses.', "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  // Add new status
  const handleAdd = async () => {
    if (!newStatus.trim()) return;
    try {
      const res = await fetch(API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to add');
      setNewStatus('');
      fetchStatuses();
      showMessage("Attendance status added successfully!");
    } catch (err) {
      console.error(err);
      showMessage('Failed to add status.', "error");
    }
  };

  // Start editing
  const handleEditStart = (status) => {
    setEditingStatusId(status.id);
    setEditingStatusName(status.name);
  };

  // Save editing
  const handleEditSave = async () => {
    if (!editingStatusName.trim()) return;
    try {
      const res = await fetch(`${API_ROUTE}?id=${editingStatusId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingStatusName }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setEditingStatusId(null);
      setEditingStatusName('');
      fetchStatuses();
      showMessage("Attendance status updated successfully!");
    } catch (err) {
      console.error(err);
      showMessage('Failed to update status.', "error");
    }
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`${API_ROUTE}?id=${itemToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchStatuses();
      setItemToDelete(null);
      showMessage("Attendance status deleted successfully!");
    } catch (err) {
      console.error(err);
      showMessage('Failed to delete status.', "error");
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-2xl font-bold text-slate-800">Attendance Status Management</h1>

      {/* Add new status */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New status name"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md text-slate-800"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Status list */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {statuses.map((status) => (
            <li
              key={status.id}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
            >
              {editingStatusId === status.id ? (
                <input
                  type="text"
                  value={editingStatusName}
                  onChange={(e) => setEditingStatusName(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded-md text-slate-800"
                />
              ) : (
                <span>{status.name}</span>
              )}

              <div className="flex gap-2">
                {editingStatusId === status.id ? (
                  <button
                    onClick={handleEditSave}
                    className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditStart(status)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteRequest(status.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Attendance Status"
          message="Are you sure you want to delete this status?"
        />
      )}
    </div>
  );
};

export default AttendanceStatusManager;