'use client';

import React, { useState, useEffect } from 'react';
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification";

export default function TypesPage() {
  const [types, setTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState('');
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

  // Fetch types
  const fetchTypes = async () => {
    try {
      const res = await fetch('/api/types');
      if (!res.ok) throw new Error("Failed to fetch types");
      setTypes(await res.json());
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
    }
  };

  useEffect(() => { fetchTypes(); }, []);

  // Add type
  const handleAdd = async () => {
    if (!newTypeName.trim()) return;
    try {
      const res = await fetch('/api/types', {
        method: 'POST',
        body: JSON.stringify({ name: newTypeName }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to add type");
      setNewTypeName('');
      fetchTypes();
      showMessage("Type added successfully!");
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
    }
  };

  // Edit type
  const handleEdit = async (id, name) => {
    const newName = prompt('Enter new type name', name);
    if (!newName) return;
  
    try {
      const res = await fetch(`/api/types?id=${id}`, {  // ← use query param
        method: 'PUT',
        body: JSON.stringify({ name: newName }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (res.ok) {
        fetchTypes();
        showMessage("Type updated successfully!");
      } else {
        const err = await res.json();
        showMessage(`Edit failed: ${err.error}`, "error");
      }
    } catch (error) {
      console.error('Edit type failed:', error);
      showMessage("Failed to edit type.", "error");
    }
  };
  
  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/types?id=${itemToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete type");
      fetchTypes();
      setItemToDelete(null);
      showMessage("Type deleted successfully!");
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };
  
  return (
    <div className="p-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-2xl font-bold mb-4">Material Types</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          placeholder="New type name"
          className="border px-3 py-2 rounded-md flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Type
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((t) => (
            <tr key={t.id}>
              <td className="border px-2 py-1">{t.name}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(t.id, t.name)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteRequest(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Material Type"
          message="Are you sure you want to delete this type?"
        />
      )}
    </div>
  );
}
