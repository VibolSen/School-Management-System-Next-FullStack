"use client";

import { useState, useEffect } from "react";
import FeeModal from "./FeeModal";

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fees Management</h1>
        <button
          onClick={handleAddFee}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Fee
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{fee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fee.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${fee.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEditFee(fee)}
                      className="text-blue-500 hover:text-blue-600 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFee(fee.id)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <FeeModal
          fee={selectedFee}
          onClose={closeModal}
          onFeeSaved={onFeeSaved}
        />
      )}
    </div>
  );
}
