"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import { X, CreditCard, Hash, Calendar, DollarSign, FileText, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PaymentModal({ isOpen, payment, onClose, onPaymentSaved, showMessage }) {
  const [formData, setFormData] = useState({
    invoiceId: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "",
    transactionId: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const paymentMethods = [
    { value: "CASH", label: "Cash" },
    { value: "CREDIT_CARD", label: "Credit Card" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "OTHER", label: "Other" },
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (payment) {
      setFormData({
        invoiceId: payment.invoiceId,
        amount: payment.amount,
        paymentDate: new Date(payment.paymentDate).toISOString().split("T")[0],
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId || "",
        notes: payment.notes || "",
      });
      setSelectedInvoice({
        value: payment.invoiceId,
        label: `Invoice ID: ${payment.invoiceId.substring(payment.invoiceId.length - 8)} (Student: ${payment.invoice.student.firstName} ${payment.invoice.student.lastName})`,
      });
    } else {
      setFormData({
        invoiceId: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "",
        transactionId: "",
        notes: "",
      });
      setSelectedInvoice(null);
    }
  }, [payment]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/admin/invoices"); // Assuming this endpoint returns all invoices
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvoiceSelectChange = (selectedOption) => {
    setSelectedInvoice(selectedOption);
    setFormData((prev) => ({ ...prev, invoiceId: selectedOption ? selectedOption.value : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = payment ? `/api/admin/payments/${payment.id}` : "/api/admin/payments";
    const method = payment ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showMessage(`Payment ${payment ? "updated" : "recorded"} successfully!`, "success");
        onPaymentSaved();
      } else {
        const errorData = await response.json();
        showMessage(errorData.message || "Failed to save payment", "error");
      }
    } catch (error) {
       showMessage(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Custom styles for react-select to match our premium theme
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'rgb(248, 250, 252)', // bg-slate-50
      borderColor: state.isFocused ? '#3b82f6' : 'rgb(226, 232, 240)', // border-blue-500 : border-slate-200
      borderRadius: '0.75rem', // rounded-xl
      padding: '2px',
      fontSize: '0.875rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#93c5fd', // hover:border-blue-300
      }
    }),
    placeholder: (base) => ({ ...base, color: '#94a3b8' }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px border-slate-100',
      zIndex: 100
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#eff6ff' : 'transparent',
      color: state.isFocused ? '#2563eb' : '#475569',
      cursor: 'pointer',
      fontSize: '0.875rem'
    })
  };

  const modalContent = (
    <AnimatePresence>
      {(isOpen || payment) && (
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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-full overflow-hidden flex flex-col border border-white/20"
        >
          <div className="p-5 border-b bg-gradient-to-r from-slate-50 to-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{payment ? "Edit Payment" : "New Payment"}</h2>
                  <p className="text-xs text-slate-500">Record and track transactions</p>
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
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Invoice</label>
                <Select
                  options={invoices.map((inv) => ({
                    value: inv.id,
                    label: `Inv #${inv.id.substring(inv.id.length - 6)} - ${inv.student.firstName} ${inv.student.lastName}`,
                  }))}
                  value={selectedInvoice}
                  onChange={handleInvoiceSelectChange}
                  styles={selectStyles}
                  placeholder="Select invoice to pay..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Amount ($)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Payment Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Method</label>
                  <Select
                    options={paymentMethods}
                    value={paymentMethods.find(m => m.value === formData.paymentMethod)}
                    onChange={(opt) => setFormData(prev => ({ ...prev, paymentMethod: opt ? opt.value : "" }))}
                    styles={selectStyles}
                    placeholder="Method"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Transaction ID</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 placeholder-slate-400 resize-none hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                  placeholder="Additional transaction info..."
                />
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
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="xs" color="white" />
                ) : (
                  payment ? "Update Payment" : "Record Payment"
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
