"use client";

import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Receipt, 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const configs = {
    PAID: {
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      label: 'Paid'
    },
    SENT: {
      color: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
      icon: <ArrowUpRight className="w-3 h-3 mr-1" />,
      label: 'Sent'
    },
    OVERDUE: {
      color: 'bg-rose-500/10 text-rose-600 border-rose-200/50',
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      label: 'Overdue'
    },
    DRAFT: {
      color: 'bg-slate-500/10 text-slate-600 border-slate-200/50',
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: 'Draft'
    },
    CANCELLED: {
      color: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: 'Cancelled'
    }
  };

  const config = configs[status] || configs.DRAFT;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <motion.div 
    whileHover={{ y: -3 }}
    className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{title}</h3>
      <p className="text-xl font-bold text-slate-900 mt-0.5 tracking-tight">{value}</p>
      {subtitle && <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-tight">{subtitle}</p>}
    </div>
  </motion.div>
);

const InvoiceItem = ({ invoice }) => {
  const totalPaid = invoice.payments ? invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
  const outstandingAmount = invoice.totalAmount - totalPaid;
  const isOverdue = invoice.status === 'OVERDUE' || (invoice.status === 'SENT' && new Date(invoice.dueDate) < new Date());

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${isOverdue ? 'bg-rose-500' : 'bg-blue-600'} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors">
            <Receipt className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-slate-900 text-sm">#{invoice.id.substring(0, 8).toUpperCase()}</h3>
              <StatusBadge status={isOverdue ? 'OVERDUE' : invoice.status} />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Inv: {new Date(invoice.issueDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Amount Due</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-xs font-bold text-slate-400">$</span>
              <span className={`text-lg font-black ${outstandingAmount > 0 ? 'text-blue-600' : 'text-slate-600'}`}>
                {outstandingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Link 
            href={`/student/invoices/${invoice.id}`}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg transition-all duration-200 text-xs shadow-sm shadow-blue-200"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const StudentInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/student/invoices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (e) {
        console.error("Failed to fetch invoices:", e);
        setError("Failed to load invoices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paid = invoices.reduce((sum, inv) => {
      const p = inv.payments ? inv.payments.reduce((s, pay) => s + pay.amount, 0) : 0;
      return sum + p;
    }, 0);
    const outstanding = total - paid;
    const pendingCount = invoices.filter(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED').length;

    return { total, paid, outstanding, pendingCount };
  }, [invoices]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" color="blue" />
        <p className="mt-4 text-slate-400 text-xs font-bold tracking-widest animate-pulse uppercase">Syncing financial records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md mx-auto mt-12">
        <div className="inline-flex p-3 bg-rose-50 rounded-full mb-3">
          <AlertCircle className="text-rose-500 w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Access Error</h2>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed px-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-5 px-5 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors text-xs"
        >
          Check Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Invoices</h1>
          <p className="text-slate-500 text-xs font-semibold">Financial summary and payment history</p>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-100/50">
          <Wallet className="w-3 h-3" />
          Last Updated: {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard 
          title="Total Billed" 
          value={`$${stats.total.toLocaleString()}`} 
          icon={Receipt} 
          color="bg-blue-600"
          subtitle="All academic charges"
        />
        <StatCard 
          title="Completed" 
          value={`$${stats.paid.toLocaleString()}`} 
          icon={TrendingDown} 
          color="bg-emerald-500"
          subtitle="Processed payments"
        />
        <StatCard 
          title="Outstanding" 
          value={`$${stats.outstanding.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-orange-500"
          subtitle="Balance to settle"
        />
        <StatCard 
          title="Pending" 
          value={stats.pendingCount} 
          icon={AlertCircle} 
          color="bg-rose-500"
          subtitle="Requiring attention"
        />
      </div>

      {/* Invoice List */}
      <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/60">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Transaction History</h2>
          <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black">
            {invoices.length}
          </span>
        </div>

        {invoices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-white/50"
          >
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
              <CreditCard className="w-5 h-5 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No active invoices</h3>
            <p className="text-slate-500 text-[10px] mt-1 max-w-[240px] mx-auto font-medium">
              You're all set! No tuition fees or outstanding bills were found on your record.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-2.5">
            <AnimatePresence mode="popLayout">
              {invoices.map((invoice) => (
                <InvoiceItem key={invoice.id} invoice={invoice} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-lg shadow-blue-200/50">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-1">Billing Questions?</h3>
          <p className="text-blue-100 text-[11px] max-w-sm font-medium leading-relaxed">
            Our finance advisory team is available to discuss payment plans, scholarships, or any billing discrepancies.
          </p>
        </div>
        <button className="relative z-10 px-6 py-2.5 bg-white text-blue-900 text-xs font-black rounded-lg hover:bg-blue-50 transition-all shadow-md active:scale-95 uppercase tracking-wider">
          Contact Advisory
        </button>
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/5 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};

export default StudentInvoicesPage;