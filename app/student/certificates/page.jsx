"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

const MyCertificatesPage = () => {
  const { user } = useUser();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/certificates?userId=${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Certificates</h1>
      {certificates.length === 0 ? (
        <p>You have not been awarded any certificates yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">{certificate.course.name}</h2>
              <p className="text-gray-600">Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</p>
              <Link href={`/student/certificates/${certificate.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
                View Certificate
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificatesPage;
