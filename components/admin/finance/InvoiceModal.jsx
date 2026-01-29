"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import { X, FileText, User, Calendar, Plus, Trash2, DollarSign, List, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvoiceModal({ isOpen, invoice, onClose, onInvoiceSaved, showMessage }) {
  const [formData, setFormData] = useState({
    studentId: "",
    issueDate: "",
    dueDate: "",
    items: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentInvoiceItem, setCurrentInvoiceItem] = useState({
    feeId: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  useEffect(() => {
    if (invoice) {
      setFormData({
        studentId: invoice.studentId,
        issueDate: new Date(invoice.issueDate).toISOString().split("T")[0],
        dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
        items: invoice.items.map(item => ({
            feeId: item.feeId,
            description: item.description,
            amount: item.amount,
        })),
      });
      setSelectedStudent({
        value: invoice.studentId,
        label: `${invoice.student.firstName} ${invoice.student.lastName} (${invoice.student.email})`,
      });
    } else {
      setFormData({
        studentId: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0], // 30 days from now
        items: [],
      });
      setSelectedStudent(null);
    }
  }, [invoice]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/users"); // Assuming this endpoint returns all users
      if (response.ok) {
        const data = await response.json();
        setStudents(data.filter(user => user.role === 'STUDENT')); // Filter for students
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await fetch("/api/admin/fees");
      if (response.ok) {
        const data = await response.json();
        setFees(data);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelectChange = (selectedOption) => {
    setSelectedStudent(selectedOption);
    setFormData((prev) => ({ ...prev, studentId: selectedOption ? selectedOption.value : "" }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentInvoiceItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemFeeSelect = (selectedOption) => {
    const selectedFee = fees.find(f => f.id === selectedOption.value);
    setCurrentInvoiceItem((prev) => ({
      ...prev,
      feeId: selectedOption.value,
      description: selectedFee ? selectedFee.description : '',
      amount: selectedFee ? selectedFee.amount.toString() : '',
    }));
  };

  const handleAddItem = () => {
    if (currentInvoiceItem.feeId && currentInvoiceItem.description && currentInvoiceItem.amount) {
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            feeId: currentInvoiceItem.feeId,
            description: currentInvoiceItem.description,
            amount: parseFloat(currentInvoiceItem.amount),
          },
        ],
      }));
      setCurrentInvoiceItem({ feeId: "", description: "", amount: "" });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = invoice ? `/api/admin/invoices/${invoice.id}` : "/api/admin/invoices";
    const method = invoice ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showMessage(`Invoice ${invoice ? "updated" : "created"} successfully!`, "success");
        onInvoiceSaved();
      } else {
        const errorData = await response.json();
        showMessage(errorData.message || "Failed to save invoice", "error");
      }
    } catch (error) {
       showMessage(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = formData.items.reduce((acc, item) => acc + item.amount, 0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'rgb(248, 250, 252)',
      borderColor: state.isFocused ? '#6366f1' : 'rgb(226, 232, 240)',
      borderRadius: '0.75rem',
      padding: '1px',
      fontSize: '0.875rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#6366f1' : '#c7d2fe',
      }
    }),
    placeholder: (base) => ({ ...base, color: '#94a3b8' }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      zIndex: 100
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#eef2ff' : 'transparent',
      color: state.isFocused ? '#4f46e5' : '#475569',
      cursor: 'pointer',
      fontSize: '0.875rem'
    })
  };

  const modalContent = (
    <AnimatePresence>
      {(isOpen || invoice) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
        >
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-indigo-50 via-white to-slate-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{invoice ? "Edit Invoice" : "Create New Invoice"}</h2>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">Financial billing system</p>
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
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Student</label>
                  <Select
                    options={students.map((s) => ({
                      value: s.id,
                      label: `${s.firstName} ${s.lastName} (${s.email})`,
                    }))}
                    value={selectedStudent}
                    onChange={handleStudentSelectChange}
                    styles={selectStyles}
                    placeholder="Search for a student..."
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Issue Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Due Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all duration-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <List className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Invoice Items</h3>
                </div>

                {/* Items List */}
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                  <AnimatePresence mode="popLayout">
                    {formData.items.length > 0 ? (
                      formData.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="group flex justify-between items-center bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 p-3 rounded-2xl transition-all duration-200 hover:shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{item.description}</p>
                            <p className="text-[10px] text-indigo-500 font-bold tracking-tight">AMOUNT: ${item.amount.toFixed(2)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                        <Info className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No items added yet</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Add New Item Compact Grid */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4 shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 ml-1">FEE TYPE</label>
                      <Select
                        options={fees.map((f) => ({ value: f.id, label: f.name }))}
                        value={fees.find(f => f.id === currentInvoiceItem.feeId) ? {value: currentInvoiceItem.feeId, label: fees.find(f => f.id === currentInvoiceItem.feeId).name} : null}
                        onChange={handleItemFeeSelect}
                        styles={selectStyles}
                        placeholder="Select Fee"
                      />
                    </div>
                    <div className="md:col-span-5 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 ml-1">DESCRIPTION</label>
                      <input
                        type="text"
                        name="description"
                        value={currentInvoiceItem.description}
                        onChange={handleItemInputChange}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm transition-all duration-200 focus:border-indigo-500"
                        placeholder="Detail..."
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 ml-1">AMOUNT</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <span className="text-xs font-bold">$</span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          value={currentInvoiceItem.amount}
                          onChange={handleItemInputChange}
                          className="w-full pl-7 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm transition-all duration-200 focus:border-indigo-500 font-semibold"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-xs font-bold shadow-sm hover:shadow hover:bg-indigo-600 hover:text-white transition-all duration-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to List
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-900 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Total Amount Due</span>
                <span className="text-2xl font-black text-white leading-none tracking-tight">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl text-xs font-black tracking-widest shadow-xl shadow-indigo-900/40 hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "PROCESSING..." : invoice ? "UPDATE INVOICE" : "CONFIRM INVOICE"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
