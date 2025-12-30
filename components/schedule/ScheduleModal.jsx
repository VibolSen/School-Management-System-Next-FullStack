import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleModal({ isOpen, onClose, onSave, schedule, isReadOnly = false }) {
  const [title, setTitle] = useState('');
  const [sessions, setSessions] = useState([{ startTime: '', endTime: '' }]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [assignedToTeacherId, setAssignedToTeacherId] = useState('');
  const [assignedToGroupId, setAssignedToGroupId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setIsRecurring(schedule.isRecurring || false);
      setStartDate(schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : '');
      setEndDate(schedule.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : '');
      setDaysOfWeek(schedule.daysOfWeek || []);
      setAssignedToTeacherId(schedule.assignedToTeacherId || '');
      setAssignedToGroupId(schedule.assignedToGroupId || '');
      // Ensure schedule.sessions is an array before setting
      if (Array.isArray(schedule.sessions) && schedule.sessions.length > 0) {
        setSessions(schedule.sessions.map(s => ({
          startTime: new Date(s.startTime).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }),
          endTime: new Date(s.endTime).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }),
        })));
      } else {
        setSessions([{ startTime: '', endTime: '' }]);
      }
    } else {
      setTitle('');
      setSessions([{ startTime: '', endTime: '' }]);
      setStartDate('');
      setEndDate('');
      setDaysOfWeek([]);
      setIsRecurring(false);
      setAssignedToTeacherId('');
      setAssignedToGroupId('');
    }
  }, [schedule]);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && !isReadOnly) {
        try {
          const [teachersRes, groupsRes] = await Promise.all([
            axios.get('/api/users?role=TEACHER'),
            axios.get('/api/groups'),
          ]);
          setTeachers(teachersRes.data);
          setGroups(groupsRes.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [isOpen, isReadOnly]);

  const handleDayOfWeekChange = (day) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddSession = () => {
    setSessions(prev => [...prev, { startTime: '', endTime: '' }]);
  };

  const handleRemoveSession = (index) => {
    setSessions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSessionChange = (index, field, value) => {
    setSessions(prev =>
      prev.map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {
      title,
      isRecurring,
      startDate: isRecurring ? startDate : null,
      endDate: isRecurring ? endDate : null,
      daysOfWeek: isRecurring ? daysOfWeek : [],
      assignedToTeacherId: assignedToTeacherId || null,
      assignedToGroupId: assignedToGroupId || null,
      sessions: sessions.map(session => ({
        startTime: session.startTime,
        endTime: session.endTime,
      })),
    };
    onSave(scheduleData);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* ... Dialog overlay ... */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                {isReadOnly ? 'Schedule Details' : (schedule ? 'Edit Schedule' : 'Create Schedule')}
              </Dialog.Title>
              <div className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title and other common fields */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full" required disabled={isReadOnly} />
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" id="isRecurring" name="isRecurring" checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} disabled={isReadOnly} />
                    <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700">Recurring Schedule</label>
                  </div>

                  {isRecurring ? (
                    <>
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" name="startDate" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full" required disabled={isReadOnly} />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" name="endDate" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full" required disabled={isReadOnly} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Days of Week</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {days.map(day => (
                            <label key={day} className="flex items-center space-x-2">
                              <input type="checkbox" value={day} checked={daysOfWeek.includes(day)} onChange={() => handleDayOfWeekChange(day)} disabled={isReadOnly} />
                              <span>{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                      <input type="date" name="date" id="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full" required={!isRecurring} disabled={isReadOnly} />
                    </div>
                  )}

                  {/* Sessions */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Sessions</h4>
                    {sessions.map((session, index) => (
                      <div key={index} className="flex space-x-2 mb-2 items-center">
                        <div>
                          <label htmlFor={`session-start-${index}`} className="block text-sm font-medium text-gray-700">Start</label>
                          <input type="time" id={`session-start-${index}`} value={session.startTime} onChange={(e) => handleSessionChange(index, 'startTime', e.target.value)} className="mt-1 block w-full" required disabled={isReadOnly} />
                        </div>
                        <div>
                          <label htmlFor={`session-end-${index}`} className="block text-sm font-medium text-gray-700">End</label>
                          <input type="time" id={`session-end-${index}`} value={session.endTime} onChange={(e) => handleSessionChange(index, 'endTime', e.target.value)} className="mt-1 block w-full" required disabled={isReadOnly} />
                        </div>
                        {!isReadOnly && sessions.length > 1 && (
                          <button type="button" onClick={() => handleRemoveSession(index)} className="mt-4 p-2 text-sm font-medium text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {!isReadOnly && (
                      <button type="button" onClick={handleAddSession} className="mt-2 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50">
                        Add Session
                      </button>
                    )}
                  </div>

                  {/* Assignment fields (moved from above) */}
                  {!isReadOnly && (
                    <>
                      <div>
                        <label htmlFor="assignedToTeacher" className="block text-sm font-medium text-gray-700">Assign to Teacher</label>
                        <select id="assignedToTeacher" name="assignedToTeacher" value={assignedToTeacherId} onChange={(e) => setAssignedToTeacherId(e.target.value)} className="mt-1 block w-full">
                          <option value="">Select Teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="assignedToGroup" className="block text-sm font-medium text-gray-700">Assign to Group</label>
                        <select id="assignedToGroup" name="assignedToGroup" value={assignedToGroupId} onChange={(e) => setAssignedToGroupId(e.target.value)} className="mt-1 block w-full">
                          <option value="">Select Group</option>
                          {groups.map((group) => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Buttons */}
                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                    {!isReadOnly && <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">{schedule ? 'Update' : 'Create'}</button>}
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}