import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';

export default function ScheduleModal({ isOpen, onClose, onSave, schedule, isReadOnly = false }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState('');
  const [assignedToTeacherId, setAssignedToTeacherId] = useState('');
  const [assignedToGroupId, setAssignedToGroupId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setStartTime(new Date(schedule.startTime).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setEndTime(new Date(schedule.endTime).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(new Date(schedule.date).toISOString().split('T')[0]);
      setAssignedToTeacherId(schedule.assignedToTeacherId || '');
      setAssignedToGroupId(schedule.assignedToGroupId || '');
    } else {
      setTitle('');
      setStartTime('');
      setEndTime('');
      setDate('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = {
      title,
      startTime: `${date}T${startTime}:00.000Z`,
      endTime: `${date}T${endTime}:00.000Z`,
      date: `${date}T00:00:00.000Z`,
      assignedToTeacherId: assignedToTeacherId || null,
      assignedToGroupId: assignedToGroupId || null,
    };
    onSave(newSchedule);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {isReadOnly ? 'Schedule Details' : (schedule ? 'Edit Schedule' : 'Create Schedule')}
                </Dialog.Title>
                <div className="mt-2">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                    {!isReadOnly && (
                      <>
                        <div>
                          <label htmlFor="assignedToTeacher" className="block text-sm font-medium text-gray-700">Assign to Teacher</label>
                          <select
                            id="assignedToTeacher"
                            name="assignedToTeacher"
                            value={assignedToTeacherId}
                            onChange={(e) => setAssignedToTeacherId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="assignedToGroup" className="block text-sm font-medium text-gray-700">Assign to Group</label>
                          <select
                            id="assignedToGroup"
                            name="assignedToGroup"
                            value={assignedToGroupId}
                            onChange={(e) => setAssignedToGroupId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select Group</option>
                            {groups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      {!isReadOnly && (
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          {schedule ? 'Update' : 'Create'}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}