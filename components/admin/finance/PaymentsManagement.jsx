"use client";

import { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // New states for ConfirmationDialog
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showMessage = (message, type = "success") => {
    if (type === "error") {
      setErrorMessage(message);
      setIsErrorModalOpen(true);
    } else {
      setSuccessMessage(message);
      setIsSuccessModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        console.error("Failed to fetch payments");
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

  const handleDeletePayment = (paymentId) => {
    setDeleteId(paymentId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/payments/${deleteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showMessage("Payment deleted successfully!", "success");
        fetchPayments();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete payment");
      }
    } catch (error) {
       showMessage(error.message, "error");
    } finally {
        setShowDeleteConfirmation(false);
        setDeleteId(null);
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
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Payments Management
        </h1>
        <button
          onClick={handleAddPayment}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment</span>
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  # ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Inv ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-400">
                    {payment.id.substring(payment.id.length - 8)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link href={`/admin/finance/invoices/${payment.invoiceId}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors uppercase">
                      {payment.invoiceId.substring(payment.invoiceId.length - 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-900">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 uppercase">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                       <button
                        onClick={() => handleEditPayment(payment)}
                        className="p-1 px-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Payment"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="p-1 px-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Payment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        payment={selectedPayment}
        onClose={closeModal}
        onPaymentSaved={onPaymentSaved}
        showMessage={showMessage}
      />

       <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
      />

       <ConfirmationDialog
        isOpen={isSuccessModalOpen}
        title="Success"
        message={successMessage}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
        confirmText="OK"
        type="success"
      />

       <ConfirmationDialog
        isOpen={isErrorModalOpen}
        title="Error"
        message={errorMessage}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        confirmText="OK"
        type="danger"
      />
    </div>
  );
}
