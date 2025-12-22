"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="ml-2 text-gray-600">Loading job postings...</p>
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
    <div className="container mx-auto p-6 animate-fadeIn duration-700">
      <h1 className="text-4xl font-extrabold text-blue-700 animate-scale-in mb-6">
        Job Postings Management
      </h1>

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