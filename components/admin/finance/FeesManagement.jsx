"use client";

import { useState, useEffect } from "react";
import FeeModal from "./FeeModal";
import { Plus, Edit, Trash2, DollarSign, Search, RefreshCcw } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function FeesManagement() {
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
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
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/fees");
      if (response.ok) {
        const data = await response.json();
        setFees(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFee = () => {
    setSelectedFee(null);
    setIsModalOpen(true);
  };

  const handleEditFee = (fee) => {
    setSelectedFee(fee);
    setIsModalOpen(true);
  };

  const handleDeleteFee = (feeId) => {
    setDeleteId(feeId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/fees/${deleteId}`, { method: "DELETE" });
      if (response.ok) {
        showMessage("Fee deleted successfully!", "success");
        fetchFees();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete fee");
      }
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteId(null);
    }
  };

  const filteredFees = fees.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Fee Structures
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Define institutional pricing, manage tuition components, and oversee academic fee configurations.
          </p>
        </div>
        <button
          onClick={handleAddFee}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={14} />
          Create Fee
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Financial Catalog</h2>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find fee structure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors" size={12} />
            </div>
            <button
               onClick={fetchFees}
               className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
               title="Refresh Feed"
            >
               <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Classification</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptive Narrative</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {isLoading && filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Compiling Ledger...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                       <DollarSign size={32} className="mx-auto text-blue-200 mb-3" />
                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Fees found</h3>
                       <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">The ledger is currently clear</p>
                    </td>
                  </tr>
                ) : (
                  filteredFees.map((fee, index) => (
                    <motion.tr
                      key={fee.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(index * 0.02, 0.4) }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shrink-0 border border-blue-100">
                             $
                          </div>
                          <span className="text-xs font-black text-slate-800 tracking-tight">{fee.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-slate-500 italic max-w-md truncate block">
                          {fee.description || 'No description provided'}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100 shadow-sm">
                           ${fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditFee(fee)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Structure"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteFee(fee.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Remove Entry"
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

      <FeeModal
        isOpen={isModalOpen}
        fee={selectedFee}
        onClose={() => { setIsModalOpen(false); setSelectedFee(null); }}
        onFeeSaved={() => { fetchFees(); setIsModalOpen(false); setSelectedFee(null); }}
        showMessage={showMessage}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Delete Fee Structure"
        message="Are you sure you want to remove this fee structure? This action cannot be undone and may affect pending invoices."
      />

      <ConfirmationDialog
        isOpen={isSuccessModalOpen}
        title="Transmission Successful"
        message={successMessage}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
        confirmText="OK"
        type="success"
      />

      <ConfirmationDialog
        isOpen={isErrorModalOpen}
        title="Transmission Error"
        message={errorMessage}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        confirmText="OK"
        type="danger"
      />
    </div>
  );
}
