"use client";

import { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal"; // This will be created next
import Link from "next/link";

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsModalOpen(true);
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleDeletePayment = async (paymentId) => {
    if (confirm("Are you sure you want to delete this payment?")) {
      try {
        const response = await fetch(`/api/admin/payments/${paymentId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchPayments();
        }
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const onPaymentSaved = () => {
    fetchPayments();
    closeModal();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payments Management</h1>
        <button
          onClick={handleAddPayment}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Payment
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.id.substring(payment.id.length - 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/finance/invoices/${payment.invoiceId}`} className="text-blue-500 hover:underline">
                      {payment.invoiceId.substring(payment.invoiceId.length - 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEditPayment(payment)}
                      className="text-blue-500 hover:text-blue-600 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
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
        <PaymentModal
          payment={selectedPayment}
          onClose={closeModal}
          onPaymentSaved={onPaymentSaved}
        />
      )}
    </div>
  );
}
