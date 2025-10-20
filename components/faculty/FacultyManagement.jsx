'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FacultyTable from './FacultyTable';
import FacultyModal from './FacultyModal';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import Notification from '@/components/Notification';

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [facultyUsers, setFacultyUsers] = useState([]); // New state for faculty users
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });

  const API_ENDPOINT = '/api/faculty';
  const FACULTY_USERS_API_ENDPOINT = '/api/users?role=FACULTY'; // API endpoint for faculty users

  const showMessage = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: '', type: '' }),
      3000
    );
  };

  const fetchFaculties = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error('Failed to fetch faculties.');
      const data = await response.json();
      setFaculties(data);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFacultyUsers = useCallback(async () => {
    try {
      const response = await fetch(FACULTY_USERS_API_ENDPOINT);
      if (!response.ok) throw new Error('Failed to fetch faculty users.');
      const data = await response.json();
      setFacultyUsers(data);
    } catch (err) {
      showMessage(err.message, 'error');
    }
  }, []);

  useEffect(() => {
    fetchFaculties();
    fetchFacultyUsers(); // Fetch faculty users on mount
  }, [fetchFaculties, fetchFacultyUsers]);

  const handleSaveFaculty = async (formData) => {
    setIsLoading(true);
    const isEditing = !!editingFaculty;
    const url = isEditing
      ? `${API_ENDPOINT}?id=${editingFaculty.id}`
      : API_ENDPOINT;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred.');
      }
      showMessage(
        `Faculty ${isEditing ? 'updated' : 'created'} successfully!`
      );
      await fetchFaculties();
      handleCloseModal();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        let errorMessage = 'Failed to delete the faculty.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // The response body is not JSON. Use the default error message.
        }
        throw new Error(errorMessage);
      }
      showMessage('Faculty deleted successfully!');
      setFaculties((prevFaculties) =>
        prevFaculties.filter((f) => f.id !== itemToDelete.id)
      );
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleAddClick = () => {
    setEditingFaculty(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (faculty) => {
    setEditingFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleAssignDirectorClick = (faculty) => {
    setEditingFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (faculty) => {
    setItemToDelete(faculty);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaculty(null);
  };

  return (
    <div className="space-y-6 p-4">
      <Notification
        {...notification}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Faculty Management
        </h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Faculty
        </button>
      </div>

      <FacultyTable
        faculties={faculties}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        onAssignDirectorClick={handleAssignDirectorClick}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <FacultyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveFaculty}
          facultyToEdit={editingFaculty}
          isLoading={isLoading}
          facultyUsers={facultyUsers} // Pass faculty users here
        />
      )}

      <ConfirmationDialog
        isOpen={!!itemToDelete}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Faculty"
        message={`Are you sure you want to delete the "${itemToDelete?.name}" faculty? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
}