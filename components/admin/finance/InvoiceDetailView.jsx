"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  ArrowLeft, 
  Printer, 
  Download, 
  Mail, 
  User, 
  Hash, 
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from 'framer-motion';

const StatusStamp = ({ status }) => {
  const configs = {
    PAID: 'text-emerald-500 border-emerald-500 rotate-[-12deg]',
    SENT: 'text-blue-500 border-blue-500 rotate-[-12deg]',
    OVERDUE: 'text-rose-500 border-rose-500 rotate-[-12deg]',
    DRAFT: 'text-slate-400 border-slate-400 rotate-[-12deg]',
    CANCELLED: 'text-amber-500 border-amber-500 rotate-[-12deg]'
  };

  return (
    <div className={`absolute top-10 right-10 border-4 px-4 py-1.5 rounded-xl font-black text-2xl uppercase tracking-widest opacity-20 pointer-events-none select-none ${configs[status] || configs.DRAFT}`}>
      {status}
    </div>
  );
};

export default function InvoiceDetailView() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
       const fetchInvoiceDetails = async () => {
        try {
          const response = await fetch(`/api/admin/invoices/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setInvoice(data);
        } catch (e) {
          console.error("Failed to fetch invoice details:", e);
          setError("Failed to secure invoice information.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchInvoiceDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" color="blue" />
        <p className="mt-4 text-slate-400 text-xs font-bold tracking-widest animate-pulse uppercase">Generating Official Document...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="inline-flex p-3 bg-rose-50 rounded-full mb-3">
          <AlertCircle className="text-rose-500 w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Document Not Found</h2>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed px-4">
          Invoice reference #{id?.substring(0,8).toUpperCase()} could not be retrieved.
        </p>
        <Link 
          href="/admin/finance/invoices"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors text-xs"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Invoices
        </Link>
      </div>
    );
  }

  const totalPaid = invoice.payments ? invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
  const outstandingAmount = invoice.totalAmount - totalPaid;

  return (
    <div className="min-h-screen bg-slate-100/50 py-10 px-6 font-sans">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link 
          href="/admin/finance/invoices" 
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Management
        </Link>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-bold text-xs shadow-sm">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all font-bold text-xs shadow-sm">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden relative"
        id="invoice-document"
      >
        <StatusStamp status={invoice.status} />

        {/* Paper Header */}
        <div className="p-12 border-b-2 border-slate-100">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div>
              <div className="mb-6 relative w-[240px] h-[75px]">
                <Image 
                  src="/logo/STEP.png" 
                  alt="STEP Academy" 
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="space-y-1 text-xs text-slate-500 font-medium">
                <p className="flex items-center gap-2 leading-none"><MapPin className="w-3 h-3 text-blue-900" /> 123 Education Plaza, Knowledge District</p>
                <p className="flex items-center gap-2 leading-none"><Mail className="w-3 h-3 text-blue-900" /> billing@stepacademy.edu</p>
                <p className="flex items-center gap-2 leading-none"><Hash className="w-3 h-3 text-blue-900" /> +1 (555) 900-STEP</p>
              </div>
            </div>
            <div className="text-left md:text-right flex flex-col items-start md:items-end">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 opacity-10">INVOICE</h2>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Document Number</p>
                <p className="text-lg font-black text-slate-900 tracking-tight leading-none">INV-{invoice.id.substring(0, 8).toUpperCase()}</p>
                <div className="pt-2 flex flex-col md:items-end gap-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 leading-none">
                    <Calendar className="w-3 h-3 text-blue-900" />
                    Issue Date: {new Date(invoice.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-500 leading-none">
                    <Clock className="w-3 h-3" />
                    Due Date: {new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-12 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50/50 border-b border-slate-100">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200">Bill To (Recipient)</h3>
            <div className="space-y-1">
              <p className="text-lg font-black text-slate-900 tracking-tight">{invoice.student.firstName} {invoice.student.lastName}</p>
              <div className="text-xs text-slate-500 font-bold space-y-1 mt-2">
                <p className="flex items-center gap-2 opacity-80"><User className="w-3 h-3 text-blue-600" /> Student ID: {invoice.student.id.substring(0, 8).toUpperCase()}</p>
                <p className="flex items-center gap-2 opacity-80"><Mail className="w-3 h-3 text-blue-600" /> {invoice.student.email}</p>
              </div>
              <Link href={`/admin/students/${invoice.student.id}`} className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest mt-4 group">
                View Profile <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="md:text-right">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200 inline-block md:min-w-[200px]">Payment Summary</h3>
             <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Billed:</span>
                  <span className="text-sm font-black text-slate-900">${invoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">TOTAL CREDITS:</span>
                  <span className="text-sm font-black text-blue-600">-${totalPaid.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between md:justify-end gap-4">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Balance Due:</span>
                  <span className="text-xl font-black text-blue-900">${outstandingAmount.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="px-12 py-10 border-b border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Itemized Billing Ledger</h3>
          <div className="overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900">
                  <th className="px-2 py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 w-16 italic">REF</th>
                  <th className="px-2 py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Description / Fee Category</th>
                  <th className="px-2 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-900">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="text-slate-700">
                    <td className="px-2 py-5 text-[10px] font-black text-slate-300">0{index + 1}</td>
                    <td className="px-2 py-5">
                      <p className="text-sm font-black text-slate-900 tracking-tight">{item.fee?.name || 'ACADEMIC FEE'}</p>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1 uppercase italic tracking-wide">{item.description || 'Academic service fee'}</p>
                    </td>
                    <td className="px-2 py-5 text-right font-black text-slate-900 text-sm">
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" className="px-2 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest pt-8">Grand Total</td>
                  <td className="px-2 py-6 text-right text-xl font-black text-blue-900 pt-8">${invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payments Section */}
        <div className="px-12 py-10 bg-slate-50/30">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 pb-2 border-b border-slate-100">Official Payment History</h3>
          {invoice.payments && invoice.payments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">{payment.paymentMethod}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase leading-none">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-600 leading-none">+${payment.amount.toLocaleString()}</p>
                    <p className="text-[8px] text-slate-300 font-medium uppercase tracking-tighter mt-1">ID: {payment.transactionId?.substring(0,8) || 'RCV_BANK'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-white border border-slate-100 rounded-xl border-dashed">
              <div className="inline-flex p-3 bg-slate-50 rounded-full mb-2">
                <CreditCard className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No recorded payments</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="bg-blue-950 p-8 text-center">
          <p className="text-[9px] text-blue-200 font-black uppercase tracking-[0.3em] mb-2">System Generated Independent Financial Record</p>
          <p className="text-[8px] text-blue-400 font-medium px-20 leading-relaxed uppercase tracking-widest">
            This document serves as an official financial record for Step Academy internal management. 
            All transactions are subject to standard audit procedures.
          </p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto mt-8 flex justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
        &copy; {new Date().getFullYear()} Step Academy Finance & bull; Administrator Access
      </div>
    </div>
  );
}
