import React from "react";
import Link from "next/link";
import { FiEye, FiCalendar, FiDollarSign } from "react-icons/fi";

const StudentInvoicesList = ({ invoices }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">No invoices found.</p>
        <p className="text-gray-500 text-md">Check back later or contact support if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {invoice.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <FiDollarSign className="text-green-500 mr-1" />
                  {invoice.totalAmount ? invoice.totalAmount.toFixed(2) : "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <FiCalendar className="text-blue-500 mr-1" />
                  {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/student/invoices/${invoice.id}`}
                  className="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <FiEye className="mr-1" /> View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentInvoicesList;
