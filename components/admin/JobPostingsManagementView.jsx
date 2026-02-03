"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Plus } from "lucide-react";
import JobPostingForm from "@/components/admin/JobPostingForm";
import JobPostingTable from "@/components/admin/JobPostingTable";

export default function JobPostingsManagementView() {
  const { user: currentUser } = useUser();
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const canManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'HR';

  const showMessage = (message, type = "success") => {
    if (type === "error") {
      setErrorMessage(message);
      setIsErrorModalOpen(true);
    } else {
      setSuccessMessage(message);
      setIsSuccessModalOpen(true);
    }
  };

  const fetchJobPostings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/job-postings");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch job postings");
      }
      setJobPostings(data);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobPostings();
  }, [fetchJobPostings]);

  const handleAddJob = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  const handleSaveSuccess = () => {
    fetchJobPostings();
    handleCloseForm();
    showMessage("Job posting saved successfully!");
  };

  const handleDeleteClick = (jobId) => {
    const job = jobPostings.find((j) => j.id === jobId);
    if (job) {
      setJobToDelete(job);
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    if (!jobToDelete) return;

    try {
      const res = await fetch(`/api/admin/job-postings/${jobToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete job posting");
      }
      showMessage("Job posting deleted successfully!");
      fetchJobPostings(); // Refresh the list
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setJobToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setJobToDelete(null);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  if (isLoading && jobPostings.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoadingSpinner size="lg" color="blue" className="mb-3" />
        <p className="text-gray-600">Loading job postings...</p>
      </div>
    );
  }

  if (error && jobPostings.length === 0) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Institutional Careers
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Publish vacancies, coordinate talent acquisition, and oversee institutional recruitment drives.
          </p>
        </div>
        {canManage && (
          <button
            onClick={handleAddJob}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={14} />
            Publish Vacancy
          </button>
        )}
      </div>

      <JobPostingTable
        jobPostings={jobPostings}
        onAddJobClick={handleAddJob}
        onEditClick={handleEditJob}
        onDeleteClick={handleDeleteClick}
        isLoading={isLoading}
        currentUserRole={currentUser?.role}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the job posting "${jobToDelete?.title}"? This action cannot be undone.`}
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

      <JobPostingForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSaveSuccess={handleSaveSuccess}
        initialData={editingJob}
      />
    </div>
  );
}