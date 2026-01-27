"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, TrendingDown, FileText, Calendar, DollarSign, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpenseModal({ isOpen, expense, onClose, onExpenseSaved }) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category,
        description: expense.description || "",
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        category: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = expense ? `/api/admin/expenses/${expense.id}` : "/api/admin/expenses";
    const method = expense ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onExpenseSaved();
      } else {
        const errorData = await response.json();
        console.error("Failed to save expense:", errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {(isOpen || expense) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-full overflow-hidden flex flex-col border border-white/20"
        >
          <div className="p-5 border-b bg-gradient-to-r from-slate-50 to-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{expense ? "Edit Expense" : "New Expense"}</h2>
                  <p className="text-xs text-slate-500">Record school expenditure</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col overflow-hidden">
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white"
                  placeholder="e.g., Supplies, Utilities, Maintenance"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 placeholder-slate-400 resize-none hover:border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white"
                  placeholder="What was this expense for?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Amount ($)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1 uppercase">Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  expense ? "Save Changes" : "Record Expense"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
