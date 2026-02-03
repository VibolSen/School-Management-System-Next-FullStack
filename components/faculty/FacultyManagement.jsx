'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FacultyTable from './FacultyTable';
import FacultyModal from './FacultyModal';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { motion, AnimatePresence } from "framer-motion";


export default function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_ENDPOINT = '/api/faculty';
  const FACULTY_USERS_API_ENDPOINT = '/api/users?role=TEACHER'; // API endpoint for teachers who can be directors

  const showMessage = (message, type = "success") => {
    if (type === "error") {
      setErrorMessage(message);
      setIsErrorModalOpen(true);
    } else {
      setSuccessMessage(message);
      setIsSuccessModalOpen(true);
    }
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


  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

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


  const handleDeleteRequest = (faculty) => {
    setItemToDelete(faculty);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaculty(null);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Academic Faculties
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Coordinate faculty structures, manage academic divisions, and oversee departmental associations.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
        >
          Establish New Faculty
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >

        <FacultyTable
          faculties={faculties}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteRequest}
          onAddFacultyClick={handleAddClick}
          isLoading={isLoading}
        />
      </motion.div>

      {isModalOpen && (
        <FacultyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveFaculty}
          facultyToEdit={editingFaculty}
          isLoading={isLoading}
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
      <ConfirmationDialog
        isOpen={isSuccessModalOpen}
        title="Success"
        message={successMessage}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
        isLoading={isLoading}
        confirmText="OK"
        type="success"
      />
      <ConfirmationDialog
        isOpen={isErrorModalOpen}
        title="Error"
        message={errorMessage}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        isLoading={isLoading}
        confirmText="OK"
        type="danger"
      />
    </div>
  );
}