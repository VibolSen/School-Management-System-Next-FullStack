import React from "react";
import { Edit, Trash2, Calendar, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function AnnouncementCard({ announcement, onEdit, onDelete, currentUser }) {
  const canModify = currentUser?.role === 'ADMIN';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group"
    >
      <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="space-y-1 min-w-0">
            <h3 className="text-base font-black text-slate-800 tracking-tight line-clamp-1">{announcement.title}</h3>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <User size={10} className="text-blue-500" />
                {announcement.author.firstName} {announcement.author.lastName}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-indigo-500" />
                {new Date(announcement.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          {canModify && (
            <div className="flex gap-1 shrink-0">
              <button 
                onClick={onEdit} 
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="Edit Bulletin"
              >
                <Edit size={14} />
              </button>
              <button 
                onClick={onDelete} 
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                title="Remove Bulletin"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{announcement.content}</p>
      </div>
    </motion.div>
  );
}
