import React from "react";
import { FiDollarSign, FiCalendar, FiCreditCard, FiHash, FiInfo } from "react-icons/fi";

const StudentInvoiceDetailView = ({ invoice }) => {
  if (!invoice) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">No invoice data available.</p>
      </div>
    );
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiHash className="mr-2 text-blue-600" /> Invoice #{invoice.id.substring(0, 8)}
        </h2>
        <span
          className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(invoice.status)}`}
        >
          <FiInfo className="mr-1" /> {invoice.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Billing Details</h3>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Student Name:</span> {invoice.student?.name || "N/A"}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Student Email:</span> {invoice.student?.email || "N/A"}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Invoice Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Due Date:</span> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Payment Summary</h3>
          <p className="text-gray-600 mb-1 flex items-center">
            <FiDollarSign className="mr-1 text-green-600" />
            <span className="font-medium">Total Amount:</span> {invoice.totalAmount ? invoice.totalAmount.toFixed(2) : "0.00"}
          </p>
          <p className="text-gray-600 mb-1 flex items-center">
            <FiCreditCard className="mr-1 text-purple-600" />
            <span className="font-medium">Amount Paid:</span> {invoice.payments?.reduce((sum, p) => sum + p.amount, 0).toFixed(2) || "0.00"}
          </p>
          <p className="text-gray-600 mb-1 flex items-center">
            <FiDollarSign className="mr-1 text-red-600" />
            <span className="font-medium">Amount Due:</span> {(invoice.totalAmount - (invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0)).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Invoice Items</h3>
        {invoice.items && invoice.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-b-0 border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-800">{item.fee?.name || "N/A"}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.unitPrice?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No items listed for this invoice.</p>
        )}
      </div>

      {invoice.payments && invoice.payments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payments.map((payment, index) => (
                  <tr key={index} className="border-b last:border-b-0 border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-800">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{payment.paymentMethod || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInvoiceDetailView;
