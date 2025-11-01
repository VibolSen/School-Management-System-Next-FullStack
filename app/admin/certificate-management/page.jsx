"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CertificateForm from '@/components/certificate-management/CertificateForm';

const CertificateManagementPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [courses, setCourses] = useState([]); // To map course IDs to names

  useEffect(() => {
    fetchCertificates();
    fetchCourses();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const handleAddCertificate = () => {
    setEditingCertificate(null);
    setShowForm(true);
  };

  const handleEditCertificate = (certificate) => {
    setEditingCertificate({
      ...certificate,
      course: certificate.course.id,
    });
    setShowForm(true);
  };

  const handleDeleteCertificate = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const response = await fetch('/api/certificates', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchCertificates(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete certificate:", error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const method = editingCertificate ? 'PUT' : 'POST';
      const url = '/api/certificates';

      const payload = {
        recipient: formData.recipient,
        courseId: formData.course, // Map 'course' from form to 'courseId' for API
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        uniqueId: formData.uniqueId,
      };

      if (editingCertificate) {
        payload.id = editingCertificate.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowForm(false);
      setEditingCertificate(null);
      fetchCertificates(); // Refresh the list
    } catch (error) {
      console.error("Failed to save certificate:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCertificate(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Certificate Management</h1>

      {!showForm && (
        <button
          onClick={handleAddCertificate}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Add New Certificate
        </button>
      )}

      {showForm && (
        <CertificateForm
          initialData={editingCertificate || {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Existing Certificates</h2>
        {certificates.length === 0 ? (
          <p>No certificates found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Recipient</th>
                  <th className="py-3 px-4 text-left">Course</th>

                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4">
                      <Link href={`/admin/certificate-management/${certificate.id}`} className="text-blue-600 hover:underline">
                        {certificate.recipient}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{getCourseName(certificate.course.id)}</td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEditCertificate(certificate)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(certificate.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManagementPage;
