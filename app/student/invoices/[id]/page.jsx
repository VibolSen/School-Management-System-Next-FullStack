"use client";
// app/student/invoices/[id]/page.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiDollarSign, FiCalendar, FiFileText, FiCreditCard, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

const InvoiceDetailPage = () => {
  const { id } = useParams(); // Get invoice ID from URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invoice ID is missing.");
      setLoading(false);
      return;
    }

    const fetchInvoiceDetails = async () => {
      try {
        const response = await fetch(`/api/student/invoices/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInvoice(data);
      } catch (e) {
        console.error("Failed to fetch invoice details:", e);
        setError("Failed to load invoice details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  const statusColors = {
    DRAFT: 'bg-gray-200 text-gray-800',
    SENT: 'bg-blue-200 text-blue-800',
    PAID: 'bg-green-200 text-green-800',
    OVERDUE: 'bg-red-200 text-red-800',
    CANCELLED: 'bg-yellow-200 text-yellow-800',
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-600">Loading invoice details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <FiAlertCircle className="inline-block mr-2" size={20} />
        <p>{error}</p>
        <Link href="/student/invoices" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
          <FiArrowLeft className="mr-2" /> Back to My Invoices
        </Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-600">Invoice not found.</p>
        <Link href="/student/invoices" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
          <FiArrowLeft className="mr-2" /> Back to My Invoices
        </Link>
      </div>
    );
  }

  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingAmount = invoice.totalAmount - totalPaid;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/student/invoices" className="inline-flex items-center text-blue-600 hover:underline">
          <FiArrowLeft className="mr-2" /> Back to My Invoices
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Invoice Details</h1>
        <div></div> {/* Placeholder for alignment */}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Invoice #{invoice.id.substring(0, 8)}...</h2>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[invoice.status]}`}>
            {invoice.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
          <p className="flex items-center"><FiCalendar className="mr-2" /> Issue Date: <strong>{new Date(invoice.issueDate).toLocaleDateString()}</strong></p>
          <p className="flex items-center"><FiCalendar className="mr-2" /> Due Date: <strong>{new Date(invoice.dueDate).toLocaleDateString()}</strong></p>
          <p className="flex items-center"><FiDollarSign className="mr-2" /> Total Amount: <strong>${invoice.totalAmount.toFixed(2)}</strong></p>
          <p className="flex items-center"><FiCreditCard className="mr-2" /> Amount Paid: <strong>${totalPaid.toFixed(2)}</strong></p>
          {outstandingAmount > 0 && (
            <p className="flex items-center text-red-600 font-bold"><FiAlertCircle className="mr-2" /> Outstanding Amount: <strong>${outstandingAmount.toFixed(2)}</strong></p>
          )}
        </div>

        <hr className="my-6 border-gray-200" />

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Items</h3>
        {invoice.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Fee Name</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {invoice.items.map(item => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.description}</td>
                    <td className="py-3 px-6 text-left">{item.fee.name}</td>
                    <td className="py-3 px-6 text-right">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No items in this invoice.</p>
        )}

        <hr className="my-6 border-gray-200" />

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payments</h3>
        {invoice.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Method</th>
                  <th className="py-3 px-6 text-left">Transaction ID</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {invoice.payments.map(payment => (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-left">{payment.paymentMethod}</td>
                    <td className="py-3 px-6 text-left">{payment.transactionId || 'N/A'}</td>
                    <td className="py-3 px-6 text-right">${payment.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No payments recorded for this invoice.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
