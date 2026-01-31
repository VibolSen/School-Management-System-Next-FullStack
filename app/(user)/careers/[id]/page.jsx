"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Briefcase, MapPin, DollarSign, Clock, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import FullPageLoading from "@/components/ui/FullPageLoading";
import JobApplicationModal from "@/components/careers/JobApplicationModal"; // Import the modal

export default function JobDetailPage() {
  const { id } = useParams();
  const [jobPosting, setJobPosting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    if (!id) return;

    const fetchJobDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/careers/job-postings/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }
        setJobPosting(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (isLoading) {
    return <FullPageLoading message="Fetching job posting details..." />;
  }

  if (error) {
    return (
      <div className="text-center p-6 min-h-screen bg-gray-100">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-700">{error}</p>
        <Link href="/careers" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Job Postings
        </Link>
      </div>
    );
  }

  if (!jobPosting) {
    return (
      <div className="text-center p-6 min-h-screen bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Job Not Found</h2>
        <p className="text-gray-700">The job you are looking for does not exist or is no longer available.</p>
        <Link href="/careers" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Job Postings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <Link href="/careers" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Job Postings
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{jobPosting.title}</h1>
        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 space-x-4">
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {jobPosting.location}</span>
          <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {jobPosting.employmentType}</span>
          {jobPosting.salaryRange && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" /> {jobPosting.salaryRange}</span>}
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Posted: {format(new Date(jobPosting.postedDate), "PPP")}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Apply by: {format(new Date(jobPosting.applicationDeadline), "PPP")}</span>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{jobPosting.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Requirements:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {jobPosting.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Responsibilities:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {jobPosting.responsibilities.map((res, index) => (
              <li key={index}>{res}</li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)} // Open modal on click
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobPostingId={jobPosting.id}
        jobTitle={jobPosting.title}
      />
    </div>
  );
}
