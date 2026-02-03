'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  Award, 
  ChevronRight,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const StudentPointsPage = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const res = await fetch('/api/student/points');
      if (!res.ok) throw new Error('Failed to fetch points');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPoints(data);
      } else {
        setPoints([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = points.reduce((sum, item) => sum + item.points, 0);
  const earned = points.filter(p => p.points > 0).reduce((sum, item) => sum + item.points, 0);
  const deducted = points.filter(p => p.points < 0).reduce((sum, item) => sum + Math.abs(item.points), 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <LoadingSpinner size="lg" color="blue" className="mb-4" />
        <p className="text-slate-500 font-bold tracking-tight animate-pulse uppercase text-[11px]">Calculating Grade Points...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-slate-50/20 pb-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto p-4 md:p-6 space-y-6"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="flex items-center justify-between mb-2">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Merit Points</h1>
            <p className="text-slate-500 font-medium text-sm">Review your behavioral and academic merit standings.</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100">
            <Trophy size={20} />
          </div>
        </motion.header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Balance", value: totalPoints, icon: Award, color: "blue", sub: "Net Standing" },
            { label: "Total Earned", value: earned, icon: TrendingUp, color: "emerald", sub: "Positive Merits" },
            { label: "Total Deducted", value: deducted, icon: TrendingDown, color: "rose", sub: "Point Reductions" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-default"
            >
              <div className={`h-12 w-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shrink-0`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none py-1">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-500 tracking-tight">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table Area */}
          <div className="lg:col-span-2">
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">History Log</h3>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
                  <Activity size={12} className="text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transaction Record</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason & Context</th>
                      <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {points.length > 0 ? (
                        points.map((point, index) => (
                          <motion.tr
                            key={point.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-800 tracking-tight leading-tight">{point.reason}</span>
                                <div className="flex items-center gap-1.5 mt-1 border border-slate-100 w-fit px-1.5 py-0.5 rounded bg-white">
                                  <Calendar size={10} className="text-slate-400" />
                                  <span className="text-[9px] font-bold text-slate-500">
                                    {new Date(point.createdAt).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className={`inline-flex items-center gap-1 font-black ${point.points >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {point.points >= 0 ? <PlusCircle size={12} /> : <MinusCircle size={12} />}
                                <span className="text-sm">{point.points >= 0 ? `+${point.points}` : point.points}</span>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="p-12 text-center">
                            <div className="flex flex-col items-center opacity-40">
                              <Award size={32} className="mb-2" />
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No merit records found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-6">
            <motion.section variants={itemVariants} className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200/50 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                     <TrendingUp size={14} className="text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-50">Behavioral Intel</span>
                 </div>
                 
                 <h4 className="text-lg font-black leading-tight">
                    Your {totalPoints >= 0 ? 'positive' : 'current'} standing reflects academic integrity.
                 </h4>
                 <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                    Merit points are essential for scholarships and leadership positions. Maintain your positive balance.
                 </p>
                 
                 <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-emerald-200 uppercase tracking-tighter">Consistency Score</p>
                       <p className="text-sm font-black">
                         {(earned / (totalPoints || 1)).toFixed(1)}x Multiplier
                       </p>
                    </div>
                    <button className="h-8 w-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <ChevronRight size={16} />
                    </button>
                 </div>
               </div>
               <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
            </motion.section>

            {/* Quick Tips */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">How to earn points?</h4>
              <ul className="space-y-3">
                {[
                  { label: "Perfect Weekly Attendance", val: "+5pts" },
                  { label: "Academic Excellence", val: "+10pts" },
                  { label: "School Activity Lead", val: "+15pts" },
                ].map((tip) => (
                  <li key={tip.label} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 tracking-tight">{tip.label}</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded leading-none">{tip.val}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentPointsPage;
