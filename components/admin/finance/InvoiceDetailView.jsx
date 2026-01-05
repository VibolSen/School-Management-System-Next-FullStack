"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function InvoiceDetailView() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInvoiceDetails(id);
    }
  }, [id]);

  const fetchInvoiceDetails = async (invoiceId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/invoices/${invoiceId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setInvoice(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching invoice details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading invoice details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!invoice) {
    return <div className="p-6 text-center">Invoice not found.</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Invoice Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Invoice Information</h2>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Invoice ID:</span> {invoice.id}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Issue Date:</span>{" "}
            {new Date(invoice.issueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Due Date:</span>{" "}
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Total Amount:</span> ${invoice.totalAmount.toFixed(2)}
          </p>
        </div>

        {invoice.student && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Student Information</h2>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Name:</span> {invoice.student.firstName}{" "}
              {invoice.student.lastName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {invoice.student.email}
            </p>
            <Link href={`/admin/students/${invoice.student.id}`} className="text-blue-500 hover:underline text-sm mt-2 block">
                View Student Profile
            </Link>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-3">Invoice Items</h2>
      <div className="overflow-x-auto mb-8 border rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Description</th>
              <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Fee Type</th>
              <th className="text-right py-3 px-4 text-gray-600 font-semibold text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 text-sm">{item.description}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{item.fee?.name || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-700 text-sm text-right">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan="2" className="py-3 px-4 text-right text-gray-800 font-semibold text-base">Total:</td>
              <td className="py-3 px-4 text-right text-gray-800 font-semibold text-base">${invoice.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-3">Payments</h2>
      <div className="overflow-x-auto mb-8 border rounded-lg">
        {invoice.payments && invoice.payments.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Payment Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Method</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Transaction ID</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((payment) => (
                <tr key={payment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700 text-sm">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700 text-sm">{payment.paymentMethod}</td>
                  <td className="py-3 px-4 text-gray-700 text-sm">{payment.transactionId || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-700 text-sm text-right">${payment.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan="3" className="py-3 px-4 text-right text-gray-800 font-semibold text-base">Total Paid:</td>
                <td className="py-3 px-4 text-right text-gray-800 font-semibold text-base">${totalPaid.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan="3" className="py-3 px-4 text-right text-blue-800 font-bold text-base">Amount Due:</td>
                <td className="py-3 px-4 text-right text-blue-800 font-bold text-base">${(invoice.totalAmount - totalPaid).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="p-4 text-gray-600">No payments recorded for this invoice yet.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/admin/finance/invoices" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Back to Invoices
        </Link>
      </div>
    </div>
  );
}
