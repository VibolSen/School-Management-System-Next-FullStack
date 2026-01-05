"use client";

import { useState, useEffect } from "react";
import InvoiceModal from "./InvoiceModal"; // This will be created next
import Link from "next/link"; // For viewing invoice details

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/admin/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setIsModalOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchInvoices();
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const onInvoiceSaved = () => {
    fetchInvoices();
    closeModal();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-600 font-medium";
      case "OVERDUE":
        return "text-red-600 font-medium";
      case "SENT":
        return "text-blue-600 font-medium";
      case "DRAFT":
        return "text-gray-600 font-medium";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoices Management</h1>
        <button
          onClick={handleAddInvoice}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Invoice
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/finance/invoices/${invoice.id}`} className="text-blue-500 hover:underline">
                      {invoice.id.substring(invoice.id.length - 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.student?.firstName} {invoice.student?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${invoice.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEditInvoice(invoice)}
                      className="text-blue-500 hover:text-blue-600 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={closeModal}
          onInvoiceSaved={onInvoiceSaved}
        />
      )}
    </div>
  );
}
