import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

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
    if (isReadOnly) return;
    const scheduleData = {
      title,
      isRecurring,
      startDate: startDate,
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

  const inputStyle = "text-sm mt-1 block w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";
  const checkboxStyle = "h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform rounded-2xl bg-gray-50 text-left align-middle shadow-2xl transition-all flex flex-col max-h-[90vh]">
                <div className="bg-indigo-600 px-4 py-3 rounded-t-2xl text-white">
                    <Dialog.Title as="h3" className="text-xl font-bold leading-6">
                    {isReadOnly ? 'Schedule Details' : (schedule ? 'Edit Schedule' : 'Create New Schedule')}
                    </Dialog.Title>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4">
                  <form id="schedule-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-xs font-semibold text-gray-800">Title</label>
                      <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} required disabled={isReadOnly} placeholder="e.g., Math Class" />
                    </div>

                    <div className="flex items-center p-2 bg-white border border-gray-200 rounded-lg">
                      <input type="checkbox" id="isRecurring" name="isRecurring" checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} disabled={isReadOnly} className={checkboxStyle}/>
                      <label htmlFor="isRecurring" className="ml-2 block text-xs font-semibold text-gray-800">Recurring Schedule</label>
                    </div>

                    {isRecurring ? (
                      <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-3 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="startDate" className="block text-xs font-medium text-gray-700">Start Date</label>
                            <input type="date" name="startDate" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputStyle} required disabled={isReadOnly} />
                          </div>
                          <div>
                            <label htmlFor="endDate" className="block text-xs font-medium text-gray-700">End Date</label>
                            <input type="date" name="endDate" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputStyle} required disabled={isReadOnly} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Days of Week</label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                            {days.map(day => (
                              <label key={day} className={`flex items-center justify-center p-1.5 rounded-lg cursor-pointer transition-all duration-200 ${daysOfWeek.includes(day) ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                <input type="checkbox" value={day} checked={daysOfWeek.includes(day)} onChange={() => handleDayOfWeekChange(day)} disabled={isReadOnly} className="sr-only" />
                                <span className="text-xs font-semibold">{day.substring(0,3)}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="date" className="block text-xs font-medium text-gray-700">Date</label>
                        <input type="date" name="date" id="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputStyle} required={!isRecurring} disabled={isReadOnly} />
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3">Sessions</h4>
                      {sessions.map((session, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <div className="flex-grow">
                            <label htmlFor={`session-start-${index}`} className="block text-xs font-medium text-gray-600">Start Time</label>
                            <input type="time" id={`session-start-${index}`} value={session.startTime} onChange={(e) => handleSessionChange(index, 'startTime', e.target.value)} className={inputStyle} required disabled={isReadOnly} />
                          </div>
                          <div className="flex-grow">
                            <label htmlFor={`session-end-${index}`} className="block text-xs font-medium text-gray-600">End Time</label>
                            <input type="time" id={`session-end-${index}`} value={session.endTime} onChange={(e) => handleSessionChange(index, 'endTime', e.target.value)} className={inputStyle} required disabled={isReadOnly} />
                          </div>
                          {!isReadOnly && sessions.length > 1 && (
                            <button type="button" onClick={() => handleRemoveSession(index)} className="p-1.5 text-red-500 bg-red-100 rounded-full hover:bg-red-200 hover:text-red-700 transition-colors self-end mb-1">
                              <TrashIcon/>
                            </button>
                          )}
                        </div>
                      ))}
                      {!isReadOnly && (
                        <button type="button" onClick={handleAddSession} className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                          <PlusIcon /> Add Session
                        </button>
                      )}
                    </div>

                    {isReadOnly && schedule && (
                      <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                        <h4 className="text-base font-semibold text-gray-800">Assignment Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="block text-xs font-medium text-gray-700">Teacher</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {schedule.creator ? `${schedule.creator.firstName} ${schedule.creator.lastName}`: 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="block text-xs font-medium text-gray-700">Group</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {schedule.assignedToGroup ? schedule.assignedToGroup.name : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isReadOnly && (
                      <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                        <h4 className="text-base font-semibold text-gray-800">Assignments</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                            <label htmlFor="assignedToTeacher" className="block text-xs font-medium text-gray-700">Assign to Teacher</label>
                            <select id="assignedToTeacher" name="assignedToTeacher" value={assignedToTeacherId} onChange={(e) => setAssignedToTeacherId(e.target.value)} className={inputStyle}>
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                                ))}
                            </select>
                            </div>
                            <div>
                            <label htmlFor="assignedToGroup" className="block text-xs font-medium text-gray-700">Assign to Group</label>
                            <select id="assignedToGroup" name="assignedToGroup" value={assignedToGroupId} onChange={(e) => setAssignedToGroupId(e.target.value)} className={inputStyle}>
                                <option value="">Select Group</option>
                                {groups.map((group) => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                            </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
                
                <div className="flex justify-end space-x-2 border-t border-gray-200 p-4">
                  <button type="button" onClick={onClose} className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all">Cancel</button>
                  {!isReadOnly && <button type="submit" form="schedule-form" className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">{schedule ? 'Update' : 'Create'}</button>}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}