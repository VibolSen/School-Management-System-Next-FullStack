"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, DollarSign, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function CareersPageContent() {
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPostings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/careers/job-postings");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch job postings");
        }
        setJobPostings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading available positions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 min-h-screen bg-gray-100">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Join Our Team
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Explore exciting career opportunities and become a part of our mission to empower learners.
        </p>

        {jobPostings.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No job openings available at the moment. Please check back later!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {jobPostings.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h2>
                <div className="flex items-center text-gray-600 text-sm mb-4 space-x-4">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</span>
                  <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.employmentType}</span>
                  {job.salaryRange && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" /> {job.salaryRange}</span>}
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Apply by {format(new Date(job.applicationDeadline), "PPP")}</span>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Responsibilities:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {job.responsibilities.map((res, index) => (
                      <li key={index}>{res}</li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`/careers/${job.id}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details & Apply
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
