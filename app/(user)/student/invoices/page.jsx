"use client";
import React, { useEffect, useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import { useUser } from "@/context/UserContext";
import StudentInvoicesList from "@/components/student/StudentInvoicesList"; // Assuming this component will be created

const StudentInvoicesPage = () => {
  const { user } = useUser();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/student/invoices");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 bg-gray-300 h-10 w-1/3 rounded"></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 h-48 bg-gray-200"></div>
          <div className="bg-white rounded-lg shadow-md p-6 h-48 bg-gray-200"></div>
          <div className="bg-white rounded-lg shadow-md p-6 h-48 bg-gray-200"></div>
        </div>
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
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Access Denied!</strong>
          <span className="block sm:inline"> Please log in to view your invoices.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <FiDollarSign className="text-blue-600 text-4xl mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">My Invoices</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {invoices.length > 0 ? (
          <StudentInvoicesList invoices={invoices} />
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No invoices found.</p>
            <p className="text-gray-500 text-md">Check back later or contact support if you believe this is an error.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInvoicesPage;
