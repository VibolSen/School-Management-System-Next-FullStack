"use client";

import { useState, useEffect } from "react";
import FeeModal from "./FeeModal";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function FeesManagement() {
  const [fees, setFees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

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

  const handleAddFee = () => {
    setSelectedFee(null);
    setIsModalOpen(true);
  };

  const handleEditFee = (fee) => {
    setSelectedFee(fee);
    setIsModalOpen(true);
  };

  const handleDeleteFee = async (feeId) => {
    if (confirm("Are you sure you want to delete this fee?")) {
      try {
        const response = await fetch(`/api/admin/fees/${feeId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchFees();
        }
      } catch (error) {
        console.error("Error deleting fee:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFee(null);
  };

  const onFeeSaved = () => {
    fetchFees();
    closeModal();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Fees Management
        </h1>
        <button
          onClick={handleAddFee}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fee</span>
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-700">{fee.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{fee.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-900">${fee.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditFee(fee)}
                        className="p-1 px-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Fee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFee(fee.id)}
                        className="p-1 px-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Fee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FeeModal
        isOpen={isModalOpen}
        fee={selectedFee}
        onClose={closeModal}
        onFeeSaved={onFeeSaved}
      />
    </div>
  );
}
