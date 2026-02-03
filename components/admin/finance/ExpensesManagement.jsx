"use client";

import { useState, useEffect } from "react";
import ExpenseModal from "./ExpenseModal";
import { Plus, Edit, Trash2, Receipt, Search, RefreshCcw } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpensesManagement() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
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
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data || []);
      }
    } catch (error) {
       console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (expenseId) => {
    setDeleteId(expenseId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/expenses/${deleteId}`, { method: "DELETE" });
      if (response.ok) {
        showMessage("Expense deleted successfully!", "success");
        fetchExpenses();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete expense");
      }
    } catch (error) {
       showMessage(error.message, "error");
    } finally {
        setShowDeleteConfirmation(false);
        setDeleteId(null);
    }
  };

  const filteredExpenses = expenses.filter(e => 
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Expenditure Tracker
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Maintain institutional spending logs, categorize operational outflows, and monitor fiscal disbursements.
          </p>
        </div>
        <button
          onClick={handleAddExpense}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={14} />
          Record Expense
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
           <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Outflow Register</h2>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="Find expenditure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-slate-700 hover:border-slate-300 shadow-sm"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors" size={12} />
            </div>
            <button
               onClick={fetchExpenses}
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
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Value Date</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {isLoading && filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Expenditures...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <Receipt size={32} className="mx-auto text-slate-200 mb-3" />
                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">No Expenditures found</h3>
                       <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Institutional overhead is currently unrecorded</p>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp, index) => (
                    <motion.tr
                      key={exp.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(index * 0.02, 0.4) }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[9px] font-black uppercase tracking-widest border border-rose-100 shadow-sm">
                           {exp.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-slate-500 italic max-w-md truncate block">
                          {exp.description || 'No description provided'}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="text-xs font-black text-slate-900 tabular-nums">
                          ${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase tracking-tight">
                          {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditExpense(exp)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Record"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Purge Record"
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
      <ExpenseModal
        isOpen={isModalOpen}
        expense={selectedExpense}
        onClose={() => { setIsModalOpen(false); setSelectedExpense(null); }}
        onExpenseSaved={() => { fetchExpenses(); setIsModalOpen(false); setSelectedExpense(null); }}
        showMessage={showMessage}
      />

       <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Purge Expenditure"
        message="Are you sure you want to remove this expense record? This action will permanently delete the transaction from the registry."
      />

       <ConfirmationDialog
        isOpen={isSuccessModalOpen}
        title="Auditing Sync Success"
        message={successMessage}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
        confirmText="OK"
        type="success"
      />

       <ConfirmationDialog
        isOpen={isErrorModalOpen}
        title="Auditing Procedural Error"
        message={errorMessage}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        confirmText="OK"
        type="danger"
      />
    </div>
  );
}
