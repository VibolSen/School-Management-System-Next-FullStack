"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext"; // Import useUser
import { Loader2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import StatusMessage from "@/components/StatusMessage";
import JobPostingForm from "@/components/admin/JobPostingForm";
import JobPostingTable from "@/components/admin/JobPostingTable";

export default function JobPostingsManagementView() {
  const { user: currentUser } = useUser(); // Get the current user
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

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
      setStatusMessage({ type: "error", message: err.message });
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
      setStatusMessage({ type: "success", message: "Job posting deleted successfully!" });
      fetchJobPostings(); // Refresh the list
    } catch (err) {
      setStatusMessage({ type: "error", message: err.message });
    } finally {
      setJobToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setJobToDelete(null);
  };

  if (isLoading && jobPostings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="ml-2 text-gray-600">Loading job postings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Postings Management</h1>

      {statusMessage && (
        <div className="mb-4">
          <StatusMessage type={statusMessage.type} message={statusMessage.message} />
        </div>
      )}

        <JobPostingTable
            jobPostings={jobPostings}
            onAddJobClick={handleAddJob}
            onEditClick={handleEditJob}
            onDeleteClick={handleDeleteClick}
            isLoading={isLoading}
            currentUserRole={currentUser?.role} // Pass the role to the table
        />

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the job posting "${jobToDelete?.title}"? This action cannot be undone.`}
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
