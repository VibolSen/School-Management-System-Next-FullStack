"use client";

import { useState, useEffect } from "react";
import InvoiceModal from "./InvoiceModal";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2, FileText, Search, RefreshCcw, Filter } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const handleDeleteInvoice = (invoiceId) => {
    setDeleteId(invoiceId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/invoices/${deleteId}`, { method: "DELETE" });
      if (response.ok) {
        showMessage("Invoice deleted successfully!", "success");
        fetchInvoices();
      } else {
         const data = await response.json();
        throw new Error(data.error || "Failed to delete invoice");
      }
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
        setShowDeleteConfirmation(false);
        setDeleteId(null);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = (inv.student?.firstName + " " + inv.student?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "OVERDUE": return "bg-rose-50 text-rose-700 border-rose-100";
      case "SENT": return "bg-blue-50 text-blue-700 border-blue-100";
      case "DRAFT": return "bg-slate-50 text-slate-500 border-slate-100";
      default: return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Accounts Receivable
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Generate student billings, track payment cycles, and manage institutional revenue streams.
          </p>
        </div>
        <button
          onClick={handleAddInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={14} />
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
           <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Invoice Registry</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
             <div className="relative group flex-1 md:w-36">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors" size={12} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-slate-700 cursor-pointer shadow-sm appearance-none"
              >
                <option value="ALL">All States</option>
                <option value="PAID">Settled</option>
                <option value="SENT">Issued</option>
                <option value="OVERDUE">Defaulted</option>
                <option value="DRAFT">Pending</option>
              </select>
            </div>
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find invoice or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors" size={12} />
            </div>
            <button
               onClick={fetchInvoices}
               className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
               title="Update Feed"
            >
               <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Doc ID</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Payee Details</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Valuation</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Maturity Date</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {isLoading && filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                       <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Accounts...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                       <FileText size={32} className="mx-auto text-blue-200 mb-3" />
                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Invoices found</h3>
                       <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Registry is complete but currently empty</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv, index) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(index * 0.02, 0.4) }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight tabular-nums">
                          INV-{inv.id.substring(inv.id.length - 6)}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100 uppercase">
                             {inv.student?.firstName.charAt(0)}{inv.student?.lastName.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800 tracking-tight">{inv.student?.firstName} {inv.student?.lastName}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Student Account</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="text-xs font-black text-slate-900 tabular-nums">
                          ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="text-[11px] font-bold text-slate-500 tabular-nums uppercase">
                          {new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/admin/finance/invoices/${inv.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Audit View"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleEditInvoice(inv)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Modify Invoice"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Void Document"
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
      <InvoiceModal
        isOpen={isModalOpen}
        invoice={selectedInvoice}
        onClose={() => { setIsModalOpen(false); setSelectedInvoice(null); }}
        onInvoiceSaved={() => { fetchInvoices(); setIsModalOpen(false); setSelectedInvoice(null); }}
        showMessage={showMessage}
      />

       <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Void Invoice"
        message="Are you sure you want to void this invoice document? This action will permanently remove it from the financial registry."
      />

       <ConfirmationDialog
        isOpen={isSuccessModalOpen}
        title="Transaction Finalized"
        message={successMessage}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
        confirmText="OK"
        type="success"
      />

       <ConfirmationDialog
        isOpen={isErrorModalOpen}
        title="Procedural Error"
        message={errorMessage}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        confirmText="OK"
        type="danger"
      />
    </div>
  );
}
