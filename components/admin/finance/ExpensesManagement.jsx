"use client";

import { useState, useEffect } from "react";
import ExpenseModal from "./ExpenseModal"; // This will be created next

export default function ExpensesManagement() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/admin/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
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

  const handleDeleteExpense = async (expenseId) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await fetch(`/api/admin/expenses/${expenseId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchExpenses();
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const onExpenseSaved = () => {
    fetchExpenses();
    closeModal();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expenses Management</h1>
        <button
          onClick={handleAddExpense}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Expense
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEditExpense(expense)}
                      className="text-blue-500 hover:text-blue-600 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
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
        <ExpenseModal
          expense={selectedExpense}
          onClose={closeModal}
          onExpenseSaved={onExpenseSaved}
        />
      )}
    </div>
  );
}
