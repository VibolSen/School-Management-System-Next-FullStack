"use client";

import { useState, useEffect } from "react";
import Select from "react-select";

export default function PaymentModal({ payment, onClose, onPaymentSaved }) {
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
        onPaymentSaved();
      } else {
        const errorData = await response.json();
        console.error("Failed to save payment:", errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {payment ? "Edit Payment" : "New Payment"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700">
                Invoice
              </label>
              <Select
                id="invoiceId"
                name="invoiceId"
                options={invoices.map((inv) => ({
                  value: inv.id,
                  label: `Invoice ID: ${inv.id.substring(inv.id.length - 8)} (Student: ${inv.student.firstName} ${inv.student.lastName})`,
                }))}
                value={selectedInvoice}
                onChange={handleInvoiceSelectChange}
                isClearable
                placeholder="Select invoice"
                className="mt-1"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <Select
                id="paymentMethod"
                name="paymentMethod"
                options={paymentMethods}
                value={paymentMethods.find(method => method.value === formData.paymentMethod)}
                onChange={(selectedOption) => setFormData((prev) => ({ ...prev, paymentMethod: selectedOption ? selectedOption.value : "" }))}
                isClearable
                placeholder="Select method"
                className="mt-1"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isLoading ? "Saving..." : payment ? "Update Payment" : "Add Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
