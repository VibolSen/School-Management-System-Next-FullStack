"use client";
import React, { useEffect, useState } from "react";
import { FiFileText, FiCalendar, FiDollarSign, FiCornerDownLeft } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import StudentInvoiceDetailView from "@/components/student/StudentInvoiceDetailView"; // Assuming this component will be created

const StudentInvoiceDetailPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id } = useParams(); // Get the invoice ID from the URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!user || !id) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/student/invoices/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [user, id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="flex items-center mb-6">
          <div className="bg-gray-300 h-10 w-1/4 rounded mr-3"></div>
          <div className="bg-gray-300 h-10 w-1/2 rounded"></div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-96 bg-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiCornerDownLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Access Denied!</strong>
          <span className="block sm:inline"> Please log in to view this invoice.</span>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiCornerDownLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> Invoice with ID "{id}" not found or you do not have permission to view it.</span>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiCornerDownLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4">
        <FiFileText className="text-blue-600 text-4xl mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Invoice Details</h1>
      </div>
      <Link href="/invoices" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <FiCornerDownLeft className="mr-2" /> Back to My Invoices
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <StudentInvoiceDetailView invoice={invoice} />
      </div>
    </div>
  );
};

export default StudentInvoiceDetailPage;
