"use client";

import { useState, useEffect } from "react";
import Select from "react-select"; // Assuming you have react-select installed or a similar component

export default function InvoiceModal({ invoice, onClose, onInvoiceSaved }) {
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
        onInvoiceSaved();
      } else {
        const errorData = await response.json();
        console.error("Failed to save invoice:", errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = formData.items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {invoice ? "Edit Invoice" : "Create New Invoice"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                  Student
                </label>
                <Select
                  id="studentId"
                  name="studentId"
                  options={students.map((s) => ({
                    value: s.id,
                    label: `${s.firstName} ${s.lastName} (${s.email})`,
                  }))}
                  value={selectedStudent}
                  onChange={handleStudentSelectChange}
                  isClearable
                  placeholder="Select student"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                  Issue Date
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Invoice Items Section */}
            <h3 className="text-xl font-bold text-gray-800 mb-2 mt-6">Invoice Items</h3>
            <div className="mb-4 border p-4 rounded-md">
              {formData.items.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                      <span>{item.description} - ${item.amount.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center mb-4">No items added yet.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                <div>
                  <label htmlFor="itemFee" className="block text-sm font-medium text-gray-700">
                    Fee Type
                  </label>
                  <Select
                    id="itemFee"
                    name="feeId"
                    options={fees.map((f) => ({ value: f.id, label: f.name }))}
                    value={fees.find(f => f.id === currentInvoiceItem.feeId) ? {value: currentInvoiceItem.feeId, label: fees.find(f => f.id === currentInvoiceItem.feeId).name} : null}
                    onChange={handleItemFeeSelect}
                    isClearable
                    placeholder="Select fee"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    id="itemDescription"
                    name="description"
                    value={currentInvoiceItem.description}
                    onChange={handleItemInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="itemAmount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="itemAmount"
                    name="amount"
                    value={currentInvoiceItem.amount}
                    onChange={handleItemInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    step="0.01"
                  />
                </div>
                <div className="md:col-span-3 text-right">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold text-gray-800 mt-4">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
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
                {isLoading ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
