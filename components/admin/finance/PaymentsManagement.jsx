"use client";

import { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal";
import Link from "next/link";
import { Plus, Edit, Trash2, CreditCard, Search, RefreshCcw, ArrowRight } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data || []);
      }
    } catch (error) {
       console.error(error);
    } finally {
      setIsLoading(false);
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
      const response = await fetch(`/api/admin/payments/${deleteId}`, { method: "DELETE" });
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

  const filteredPayments = payments.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Treasury Feed
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Monitor incoming liquidity, verify transaction authentications, and maintain fiscal reconciliation logs.
          </p>
        </div>
        <button
          onClick={handleAddPayment}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={14} />
          Log Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
           <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Cash Inflow</h2>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find transaction or link..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors" size={12} />
            </div>
            <button
               onClick={fetchPayments}
               className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
               title="Sync Stream"
            >
               <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Receipt SN</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Link</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Remittance</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Value Date</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {isLoading && filteredPayments.length === 0 ? (
                   <tr>
                    <td colSpan={6} className="py-20 text-center">
                       <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                       <CreditCard size={32} className="mx-auto text-slate-200 mb-3" />
                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Transactions found</h3>
                       <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Institutional cashflow is currently stagnant</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(index * 0.02, 0.4) }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight tabular-nums italic">
                          REC-{payment.id.substring(payment.id.length - 6)}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <Link href={`/admin/finance/invoices/${payment.invoiceId}`} className="group/link flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-tight">
                           INV-{payment.invoiceId.substring(payment.invoiceId.length - 6)}
                           <ArrowRight size={10} className="opacity-0 group-hover/link:opacity-100 transition-all -translate-x-1 group-hover/link:translate-x-0" />
                        </Link>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="text-xs font-black text-slate-900 tabular-nums">
                          ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="text-[11px] font-bold text-slate-500 tabular-nums uppercase">
                          {new Date(payment.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest border border-slate-200 inline-block shadow-sm">
                          {payment.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                           <button
                             onClick={() => handleEditPayment(payment)}
                             className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                             title="Edit Entry"
                           >
                             <Edit size={14} />
                           </button>
                           <button
                             onClick={() => handleDeletePayment(payment.id)}
                             className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                             title="Purge Transaction"
                           >
                             <Trash2 size={14} />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        payment={selectedPayment}
        onClose={() => { setIsModalOpen(false); setSelectedPayment(null); }}
        onPaymentSaved={() => { fetchPayments(); setIsModalOpen(false); setSelectedPayment(null); }}
        showMessage={showMessage}
      />

       <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Purge Transaction"
        message="Are you sure you want to remove this payment entry? This action may cause discrepancies in the corresponding invoice balance."
      />

       <ConfirmationDialog
        isOpen={isSuccessModalOpen}
        title="Ledger Synchronized"
        message={successMessage}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
        confirmText="OK"
        type="success"
      />

       <ConfirmationDialog
        isOpen={isErrorModalOpen}
        title="Fiscal Error"
        message={errorMessage}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        confirmText="OK"
        type="danger"
      />
    </div>
  );
}
