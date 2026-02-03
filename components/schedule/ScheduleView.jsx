"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleModal from './ScheduleModal';
import ScheduleCalendarView from './ScheduleCalendarView';
import ScheduleCardView from './ScheduleCardView';
import { useUser } from '@/context/UserContext';
import { Plus, Calendar, LayoutGrid, Trash2, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScheduleView() {
  const { user } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [view, setView] = useState('calendar'); // 'card' or 'calendar'
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/schedule');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCreateClick = () => {
    setCurrentSchedule(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (schedule) => {
    setCurrentSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setCurrentSchedule(event.resource);
    setIsModalOpen(true);
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      if (currentSchedule) {
        await axios.put(`/api/schedule/${currentSchedule.id}`, scheduleData);
      } else {
        await axios.post('/api/schedule', scheduleData);
      }
      fetchSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`/api/schedule/${id}`);
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleSelectSchedule = (id) => {
    setSelectedSchedules((prev) =>
      prev.includes(id) ? prev.filter((scheduleId) => scheduleId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.delete('/api/schedule', { data: { ids: selectedSchedules } });
      fetchSchedules();
      setSelectedSchedules([]);
    } catch (error) {
      console.error('Error deleting selected schedules:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">
            Institutional Agenda
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Coordinate academic sessions, manage classroom allocations, and oversee institutional timeframes.
          </p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'STUDY_OFFICE') && (
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {selectedSchedules.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-100 border border-rose-200 transition-all active:scale-95"
                >
                  <Trash2 size={14} />
                  Purge {selectedSchedules.length}
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus size={14} />
              Provision Slot
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Chronological Overview</h2>
          </div>
          
          <div className="flex p-1 bg-slate-100/50 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all duration-300 ${
                view === 'calendar' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Calendar size={12} />
              Matrix View
            </button>
            <button
              onClick={() => setView('card')}
              className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all duration-300 ${
                view === 'card' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Layout size={12} />
              Detail View
            </button>
          </div>
        </div>

        <motion.div 
          key={view}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4"
        >
          {view === 'calendar' ? (
            <ScheduleCalendarView schedules={schedules} onSelectEvent={handleSelectEvent} />
          ) : (
            <ScheduleCardView
              schedules={schedules}
              onEdit={handleEditClick}
              onDelete={handleDeleteSchedule}
              onSelectSchedule={handleSelectSchedule}
              selectedSchedules={selectedSchedules}
            />
          )}
        </motion.div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        schedule={currentSchedule}
      />
    </div>
  );
}
