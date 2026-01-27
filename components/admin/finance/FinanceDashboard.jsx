"use client";

import DashboardCard from "@/components/dashboard/DashboardCard";
import { useState, useEffect } from "react";
import { 
  Briefcase, 
  FileText, 
  CreditCard, 
  TrendingDown, 
  LayoutDashboard 
} from "lucide-react";
import { motion } from "framer-motion";

export default function FinanceDashboard() {
  const cards = [
    {
      title: "Fees",
      description: "Manage school fee structures and amounts",
      icon: <Briefcase className="w-6 h-6" />,
      href: "/admin/finance/fees",
      color: "blue"
    },
    {
      title: "Invoices",
      description: "Generate and manage student bills",
      icon: <FileText className="w-6 h-6" />,
      href: "/admin/finance/invoices",
      color: "indigo"
    },
    {
      title: "Payments",
      description: "Track student payments and transaction history",
      icon: <CreditCard className="w-6 h-6" />,
      href: "/admin/finance/payments",
      color: "emerald"
    },
    {
      title: "Expenses",
      description: "Record and monitor school expenditures",
      icon: <TrendingDown className="w-6 h-6" />,
      href: "/admin/finance/expenses",
      color: "rose"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="p-2 bg-blue-50 rounded-lg">
          <LayoutDashboard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Finance Management
          </h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Administration Console</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.href}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

