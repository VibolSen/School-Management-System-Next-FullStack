'use client';

import { useState, useEffect } from 'react';
import StatusMessage from '@/components/StatusMessage';

export default function AttendanceView() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch('/api/teacher/groups');
      const data = await res.json();
      setGroups(data);
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const fetchStudents = async () => {
        setIsLoading(true);
        const res = await fetch(`/api/teacher/groups/${selectedGroup}/students`);
        const data = await res.json();
        setStudents(data);
        setIsLoading(false);
      };
      fetchStudents();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup && date) {
      const fetchAttendance = async () => {
        const res = await fetch(`/api/teacher/groups/${selectedGroup}/attendance?date=${date}`);
        const data = await res.json();
        const attendanceMap = {};
        data.forEach((att) => {
          attendanceMap[att.studentId] = att.status;
        });
        setAttendance(attendanceMap);
      };
      fetchAttendance();
    }
  }, [selectedGroup, date]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    const attendances = Object.keys(attendance).map((studentId) => ({
      studentId,
      status: attendance[studentId],
    }));

    try {
      const res = await fetch(`/api/teacher/groups/${selectedGroup}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, attendances }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', message: 'Attendance saved successfully.' });
      } else {
        const errorData = await res.json();
        setStatusMessage({ type: 'error', message: errorData.error || 'Failed to save attendance.' });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Attendance</h1>
      {statusMessage && <StatusMessage type={statusMessage.type} message={statusMessage.message} />}
      <div className="my-4">
        <label htmlFor="group-select">Select a group:</label>
        <select
          id="group-select"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">-- Select a group --</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      <div className="my-4">
        <label htmlFor="date-select">Select a date:</label>
        <input
          id="date-select"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {isLoading ? (
        <p>Loading students...</p>
      ) : (
        <>
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{`${student.firstName} ${student.lastName}`}</td>
                  <td className="px-6 py-4">
                    <select
                      value={attendance[student.id] || ''}
                      onChange={(e) =>
                        handleAttendanceChange(student.id, e.target.value)
                      }
                    >
                      <option value="">-- Select --</option>
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LATE">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="my-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
            onClick={handleSaveAttendance}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </>
      )}
    </div>
  );
}
