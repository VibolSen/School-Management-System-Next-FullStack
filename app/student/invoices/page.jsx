"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiCalendar, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const InvoiceCard = ({ invoice }) => {
  const statusColors = {
    DRAFT: 'bg-gray-200 text-gray-800',
    SENT: 'bg-blue-200 text-blue-800',
    PAID: 'bg-green-200 text-green-800',
    OVERDUE: 'bg-red-200 text-red-800',
    CANCELLED: 'bg-yellow-200 text-yellow-800',
  };

  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingAmount = invoice.totalAmount - totalPaid;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex-1 mb-4 md:mb-0">
        <div className="flex items-center mb-2">
          <FiDollarSign className="text-blue-600 mr-2" size={20} />
          <h3 className="text-xl font-semibold text-gray-800">Invoice #{invoice.id.substring(0, 8)}...</h3>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
            {invoice.status}
          </span>
        </div>
        <p className="text-gray-600 flex items-center mb-1">
          <FiCalendar className="mr-2" /> Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 flex items-center mb-1">
          <FiCalendar className="mr-2" /> Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
        </p>
        <p className="text-gray-700 font-medium">Total: ${invoice.totalAmount.toFixed(2)}</p>
        {outstandingAmount > 0 && (
          <p className="text-red-600 font-bold mt-1">Outstanding: ${outstandingAmount.toFixed(2)}</p>
        )}
      </div>

      <div className="flex flex-col items-start md:items-end">
        <Link href={`/student/invoices/${invoice.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
          View Details
        </Link>
        {/* You can add more actions here, e.g., "Pay Now" */}
      </div>
    </div>
  );
};

const StudentInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/student/invoices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (e) {
        console.error("Failed to fetch invoices:", e);
        setError("Failed to load invoices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-12 flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading your invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <FiAlertCircle className="inline-block mr-2" size={20} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-gray-600">You don't have any invoices yet.</p>
      ) : (
        <div className="grid gap-4">
          {invoices.map(invoice => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInvoicesPage;