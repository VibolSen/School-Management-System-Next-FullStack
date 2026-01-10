"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleModal from './ScheduleModal';
import ScheduleCalendarView from './ScheduleCalendarView';
import ScheduleCardView from './ScheduleCardView';
import { useUser } from '@/context/UserContext';
import Notification from '@/components/Notification';

export default function ScheduleView() {
  const { user } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [view, setView] = useState('calendar'); // 'card' or 'calendar'
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000); // Notification disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/schedule');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
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
        setNotification({
          show: true,
          message: 'Schedule updated successfully!',
          type: 'success',
        });
      } else {
        await axios.post('/api/schedule', scheduleData);
        setNotification({
          show: true,
          message: 'Schedule created successfully!',
          type: 'success',
        });
      }
      fetchSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setNotification({
        show: true,
        message: `Error saving schedule: ${error.message}`,
        type: 'error',
      });
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`/api/schedule/${id}`);
      fetchSchedules();
      setNotification({
        show: true,
        message: 'Schedule deleted successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setNotification({
        show: true,
        message: `Error deleting schedule: ${error.message}`,
        type: 'error',
      });
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
      setNotification({
        show: true,
        message: 'Selected schedules deleted successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting selected schedules:', error);
      setNotification({
        show: true,
        message: `Error deleting selected schedules: ${error.message}`,
        type: 'error',
      });
    }
  };

  return (
    <div >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center lg:text-left">
          Schedule Management
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          {(user?.role === 'ADMIN' || user?.role === 'STUDY_OFFICE') && (
            <button
              onClick={handleCreateClick}
              className="flex-shrink-0 inline-flex items-center py-2 px-5 rounded-lg text-sm font-medium text-white bg-indigo-500 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
            >
              Create New Schedule
            </button>
          )}
          {(user?.role === 'ADMIN' || user?.role === 'STUDY_OFFICE') && selectedSchedules.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex-shrink-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
            >
              Delete Selected ({selectedSchedules.length})
            </button>
          )}
          <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl shadow-inner">
            <button
              onClick={() => setView('calendar')}
              className={`py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300 ${view === 'calendar' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView('card')}
              className={`py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300 ${view === 'card' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Card View
            </button>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mt-4">
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
        </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        schedule={currentSchedule}
      />

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </div>
  );
}
