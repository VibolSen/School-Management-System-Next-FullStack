"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import ScheduleCalendarView from './ScheduleCalendarView';
import ScheduleModal from './ScheduleModal';

export default function MyScheduleView() {
  const { user, loading: userLoading } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  useEffect(() => {
    const fetchMySchedules = async () => {
      if (userLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/me/schedules');
        setSchedules(response.data);
      } catch (err) {
        console.error('Error fetching my schedules:', err);
        setError('Failed to load schedules.');
      } finally {
        setLoading(false);
      }
    };

    fetchMySchedules();
  }, [user, userLoading]);

  const handleSelectEvent = (event) => {
    setCurrentSchedule(event.resource);
    setIsModalOpen(true);
  };

  if (loading || userLoading) {
    return <div className="text-center py-8">Loading schedules...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (schedules.length === 0) {
    return <div className="text-center py-8 text-gray-500">No schedules assigned to you.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Schedules</h2>
      <ScheduleCalendarView schedules={schedules} onSelectEvent={handleSelectEvent} />
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schedule={currentSchedule}
        isReadOnly={true}
      />
    </div>
  );
}