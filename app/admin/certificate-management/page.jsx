"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CertificateModal from '@/components/certificate-management/CertificateModal';
import CertificateTable from '@/components/certificate-management/CertificateTable';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import Notification from '@/components/Notification';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'; // Import dialog components

const CertificateManagementPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [courses, setCourses] = useState([]); // To map course IDs to names
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [sortField, setSortField] = useState("recipient"); // Default sort field
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [filterCourse, setFilterCourse] = useState(""); // New state for course filter

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      3000
    );
  };
    
      useEffect(() => {
        fetchCertificates();
        fetchCourses();
      }, []);
    
      const fetchCertificates = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/certificates');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCertificates(data);
        } catch (error) {
          console.error("Failed to fetch certificates:", error);
          showMessage(`Failed to fetch certificates: ${error.message}`, "error");
        } finally {
          setIsLoading(false);
        }
      };
    
      const fetchCourses = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/courses');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCourses(data);
        } catch (error) {
          console.error("Failed to fetch courses:", error);
          showMessage(`Failed to fetch courses: ${error.message}`, "error");
        } finally {
          setIsLoading(false);
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
    
      const handleDeleteClick = (certificate) => {
        setCertificateToDelete(certificate);
        setIsConfirmModalOpen(true);
      };
    
      const handleConfirmDelete = async () => {
        if (!certificateToDelete) return;
        setIsLoading(true);
        try {
          const response = await fetch(`/api/certificates/${certificateToDelete.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          fetchCertificates(); // Refresh the list
          showMessage('Certificate deleted successfully!', 'success');
        } catch (error) {
          console.error("Failed to delete certificate:", error);
          showMessage(`Failed to delete certificate: ${error.message}`, "error");
        } finally {
          setIsLoading(false);
          setIsConfirmModalOpen(false);
          setCertificateToDelete(null);
        }
      };
    
      const handleCancelDelete = () => {
        setIsConfirmModalOpen(false);
        setCertificateToDelete(null);
      };
    
      const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
          const method = editingCertificate ? 'PUT' : 'POST';
          const url = '/api/certificates';
    
          const payload = {
            recipient: formData.recipient,
            courseId: formData.course, // Map 'course' from form to 'courseId' for API
            issueDate: formData.issueDate,
            expiryDate: formData.expiryDate,
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
          showMessage(`Certificate ${editingCertificate ? 'updated' : 'added'} successfully!`, 'success');
        } catch (error) {
          console.error("Failed to save certificate:", error);
          showMessage(`Failed to save certificate: ${error.message}`, "error");
        } finally {
          setIsLoading(false);
        }
      };
    
        const handleCancel = () => {
          setShowForm(false);
          setEditingCertificate(null);
        };    
      const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === "asc";
        setSortOrder(isAsc ? "desc" : "asc");
        setSortField(field);
      };
    
      const sortedCertificates = [...certificates].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
    
        if (sortField === "course") {
          const aCourseName = getCourseName(a.course.id);
          const bCourseName = getCourseName(b.course.id);
          if (aCourseName < bCourseName) return sortOrder === "asc" ? -1 : 1;
          if (aCourseName > bCourseName) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
    
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    
      const filteredCertificates = sortedCertificates.filter((certificate) => {
        const matchesSearch = certificate.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              getCourseName(certificate.course.id).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilterCourse = filterCourse === "" || certificate.course.id === filterCourse;
        return matchesSearch && matchesFilterCourse;
      });
    
      return (
        <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Certificate Management</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Certificate Management</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by recipient, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCertificate}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Add New Certificate
          </button>
        </div>
      </div>

      <CertificateModal
        isOpen={showForm}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        editingCertificate={editingCertificate}
        isLoading={isLoading}
      />

      {isLoading ? (
        <p>Loading certificates...</p>
      ) : filteredCertificates.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        <CertificateTable
          certificates={filteredCertificates}
          getCourseName={getCourseName}
          handleEditCertificate={handleEditCertificate}
          handleDeleteCertificate={handleDeleteClick} // Use handleDeleteClick for confirmation
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          onAddCertificateClick={handleAddCertificate} // Pass the add handler
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCourse={filterCourse}
          setFilterCourse={setFilterCourse}
          courses={courses}
        />
      )}    
                <ConfirmationDialog
                  isOpen={isConfirmModalOpen}
                  title="Confirm Deletion"
                  message={`Are you sure you want to delete the certificate for ${certificateToDelete?.recipient}? This cannot be undone.`}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelDelete}
                  isLoading={isLoading}
                />
          
                <Notification
                  {...notification}
                  onClose={() => setNotification({ ...notification, show: false })}
                />
              </div>
            );
          };
          
          export default CertificateManagementPage;