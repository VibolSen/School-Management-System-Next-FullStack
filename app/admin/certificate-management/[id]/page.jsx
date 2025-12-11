"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CertificateDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/${id}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCertificate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    if (id) {
      fetchCertificate();
      fetchCourses();
    }
  }, [id]);

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading certificate details...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );

  if (!certificate)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Certificate not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-10 px-4">
      <div className="absolute top-4 left-4 flex gap-2">
        <Button onClick={goBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Management
        </Button>
      </div>
      <div className="relative bg-white w-full max-w-4xl aspect-[1.414/1] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-12 border border-gray-200 text-center">
        {/* Header */}
        <div className="mb-8">
          <Award className="w-10 h-10 mx-auto text-blue-500 mb-3" />
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
            Certificate of Completion
          </h1>
          <p className="text-gray-500 text-base mt-2">This certifies that</p>
        </div>

        {/* Recipient */}
        <div className="my-10">
          <h2 className="text-5xl font-bold text-gray-900 mb-3">
            {certificate.recipient}
          </h2>
          <p className="text-lg text-gray-500">
            has successfully completed the course
          </p>
        </div>

        {/* Course */}
        <div className="my-8">
          <h3 className="text-2xl font-medium text-blue-600">
            {getCourseName(certificate.course.id)}
          </h3>
          <p className="text-gray-500 mt-2">
            Issued on {new Date(certificate.issueDate).toLocaleDateString()}
          </p>
          {certificate.expiryDate && (
            <p className="text-gray-400 text-sm mt-1">
              Valid until{" "}
              {new Date(certificate.expiryDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center mt-16 text-sm text-gray-400 font-mono">
          <p>Certificate ID: {certificate.uniqueId || "N/A"}</p>
          <div className="text-right">
            <div className="border-t border-gray-300 w-40 mx-auto mb-1"></div>
            <p className="text-gray-500 font-medium">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailPage;
