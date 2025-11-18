"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleModal from './ScheduleModal';
import ScheduleCalendarView from './ScheduleCalendarView';
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Schedules</h2>
      <div className="flex justify-between mb-4">
        {(user?.role === 'ADMIN' || user?.role === 'STUDY_OFFICE') && (
          <button
            onClick={handleCreateClick}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Schedule
          </button>
        )}
        {(user?.role === 'ADMIN' || user?.role === 'STUDY_OFFICE') && selectedSchedules.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Selected ({selectedSchedules.length})
          </button>
        )}
        <div>
          <button
            onClick={() => setView('calendar')}
            className={`py-2 px-4 rounded-md text-sm font-medium ${view === 'calendar' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Calendar View
          </button>
        </div>
      </div>

      <ScheduleCalendarView schedules={schedules} onSelectEvent={handleSelectEvent} />

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