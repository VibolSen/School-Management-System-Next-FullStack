"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import StatusMessage from "@/components/StatusMessage";
import JobPostingForm from "@/components/hr/JobPostingForm";

export default function JobPostingsPage() {
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobPostings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hr/job-postings");
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
  };

  useEffect(() => {
    fetchJobPostings();
  }, []);

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
    fetchJobPostings(); // Re-fetch job postings after save
    handleCloseForm();
  };

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    if (!jobToDelete) return;

    try {
      const res = await fetch(`/api/hr/job-postings/${jobToDelete}`, {
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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoadingSpinner size="lg" color="blue" className="mb-4" />
        <p className="text-gray-600">Loading job postings...</p>
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

      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddJob}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Job Posting
        </button>
      </div>

      {jobPostings.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 text-lg">No job postings found. Click "Add New Job Posting" to create one.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobPostings.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.employmentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(job.applicationDeadline), "PPP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === "OPEN"
                          ? "bg-green-100 text-green-800"
                          : job.status === "CLOSED"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(job.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
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
