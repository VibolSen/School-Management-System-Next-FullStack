"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, DollarSign, FileText, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function FeeModal({ isOpen, fee, onClose, onFeeSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fee) {
      setFormData({
        name: fee.name,
        description: fee.description || "",
        amount: fee.amount,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        amount: "",
      });
    }
  }, [fee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = fee ? `/api/admin/fees/${fee.id}` : "/api/admin/fees";
    const method = fee ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onFeeSaved();
      } else {
        // Handle errors
        console.error("Failed to save fee");
      }
    } catch (error) {
      console.error("Error saving fee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen && !fee) return null; // Logic check
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {(isOpen || fee) && (
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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{fee ? "Edit Fee" : "New Fee"}</h2>
                    <p className="text-xs text-slate-500">Configure fee structure details</p>
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
                  <label className="text-xs font-semibold text-slate-700 ml-1">Fee Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    placeholder="e.g., Annual Tuition 2024"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 placeholder-slate-400 resize-none hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                    placeholder="Fee details and breakdown..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Amount ($)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white font-semibold text-slate-900"
                      placeholder="0.00"
                      required
                    />
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
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <LoadingSpinner size="xs" color="white" />
                  ) : (
                    fee ? "Save Changes" : "Create Fee"
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
