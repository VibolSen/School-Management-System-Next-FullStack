'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Department, Role, AttendanceStatus } from '@/lib/types';
import DashboardCard from '@/components/dashboard/DashboardCard';
import UsersIcon from '@/components/icons/UsersIcon';
import LibraryIcon from '@/components/icons/LibraryIcon';
import ChartBarIcon from '@/components/icons/ChartBarIcon';
import { GoogleGenAI } from '@google/genai';
import AISummaryCard from '@/components/AISummaryCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsView = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, staffRes, attendanceRes, coursesRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/staff'),
          fetch('/api/attendances'),
          fetch('/api/courses'),
        ]);

        if (!studentsRes.ok) throw new Error('Failed to fetch students');
        if (!staffRes.ok) throw new Error('Failed to fetch staff');
        if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
        if (!coursesRes.ok) throw new Error('Failed to fetch courses');

        const students = await studentsRes.json();
        const staff = await staffRes.json();
        const attendance = await attendanceRes.json();
        const coursesData = await coursesRes.json();

        setStudentData(students);
        setStaffData(staff);
        setAttendanceData(attendance);
        setCourses(coursesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const enrollmentByDept = useMemo(() => {
    const enrolledStudents = studentData.filter((s) => s.status === 'Enrolled');
    const data = Object.values(Department).map((dept) => ({
      name: dept,
      students: enrolledStudents.filter((student) =>
        student.courses.some((course) => course.department === dept)
      ).length,
    }));
    return data.filter((d) => d.students > 0);
  }, [studentData]);

  const staffByRole = useMemo(() => {
    const data = Object.values(Role).map((role) => ({
      name: role,
      value: staffData.filter((staff) => staff.role === role).length,
    }));
    return data.filter((d) => d.value > 0);
  }, [staffData]);

  const studentByStatus = useMemo(() => {
    const statuses = ['Enrolled', 'Graduated', 'Withdrawn'];
    return statuses.map((status) => ({
      name: status,
      count: studentData.filter((s) => s.status === status).length,
    }));
  }, [studentData]);

  const attendanceTrend = useMemo(() => {
    const attendanceByDate = {};
    attendanceData.forEach((record) => {
      if (!attendanceByDate[record.date]) {
        attendanceByDate[record.date] = { present: 0, total: 0 };
      }
      attendanceByDate[record.date].total++;
      if (
        record.status === AttendanceStatus.PRESENT ||
        record.status === AttendanceStatus.LATE
      ) {
        attendanceByDate[record.date].present++;
      }
    });

    return Object.entries(attendanceByDate)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        'Attendance Rate': Math.round((data.present / data.total) * 100),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [attendanceData]);

  const totalEnrolled = studentData.filter((s) => s.status === 'Enrolled').length;
  const totalStaff = staffData.length;
  const staffStudentRatio =
    totalStaff > 0 ? `1:${(totalEnrolled / totalStaff).toFixed(1)}` : 'N/A';
  const overallAttendance = useMemo(() => {
    const present = attendanceData.filter(
      (r) =>
        r.status === AttendanceStatus.PRESENT ||
        r.status === AttendanceStatus.LATE
    ).length;
    return attendanceData.length > 0
      ? `${((present / attendanceData.length) * 100).toFixed(1)}%`
      : 'N/A';
  }, [attendanceData]);

  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      if (!process.env.NEXT_PUBLIC_API_KEY) {
        throw new Error('API key is not configured.');
      }
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY });

      const reportData = {
        totalEnrolledStudents: totalEnrolled,
        totalStaff: totalStaff,
        staffStudentRatio: staffStudentRatio,
        overallAttendanceRate: overallAttendance,
        enrollmentByDepartment: enrollmentByDept,
        staffDistributionByRole: staffByRole,
        attendanceTrend: attendanceTrend,
        studentStatusBreakdown: studentByStatus,
      };

      const prompt = `
          You are an expert school administration analyst. Based on the following data for a school, provide a concise, insightful summary for the school principal.
          - Highlight 1-2 key successes.
          - Identify 1-2 potential areas for attention or concern.
          - Conclude with a brief, optimistic outlook.
          - Format the response with clear headings or bullet points for readability. Keep it under 150 words.

          Here is the data in JSON format:
          ${JSON.stringify(reportData, null, 2)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setSummary(response.text ?? null);
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setError(
        err.message ||
          'An unexpected error occurred. Please check your API key and network connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2'>
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>
            Reports & Analytics
          </h1>
          <p className='text-slate-500'>
            An overview of school-wide data trends and key performance
            indicators.
          </p>
        </div>
        <button
          onClick={generateSummary}
          disabled={isLoading}
          className='w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed'
        >
          <svg
            className='w-5 h-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 3a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 3zM12.5 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM5.25 6a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 005.25 6zM7.5 12.5a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM14.75 14a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 00.75.75zM12.5 14.75a.75.75 0 01.75.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM7.5 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 017.5 5.25zM10 17a.75.75 0 00-1.25-.625A5.968 5.968 0 013.75 10a.75.75 0 00-1.5 0 7.468 7.468 0 005.625 7.25A.75.75 0 0010 17z'
              clipRule='evenodd'
            />
          </svg>
          {isLoading ? 'Generating...' : 'Generate AI Summary'}
        </button>
      </div>

      {(isLoading || error || summary) && (
        <AISummaryCard
          summary={summary}
          isLoading={isLoading}
          error={error}
          onRetry={generateSummary}
        />
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <DashboardCard
          title='Staff-Student Ratio'
          value={staffStudentRatio}
          icon={<UsersIcon />}
        />
        <DashboardCard
          title='Total Enrolled Students'
          value={totalEnrolled.toString()}
          icon={<UsersIcon />}
        />
        <DashboardCard
          title='Total Courses'
          value={courses.length.toString()}
          icon={<LibraryIcon />}
        />
        <DashboardCard
          title='Overall Attendance'
          value={overallAttendance}
          icon={<ChartBarIcon />}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4 text-slate-800'>
            Enrollment by Department
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={enrollmentByDept}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='name'
                angle={-20}
                textAnchor='end'
                height={50}
                interval={0}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey='students' fill='#3b82f6' name='Students' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4 text-slate-800'>
            Staff Distribution by Role
          </h2>
          <ResponsiveContainer width='%100' height={300}>
            <PieChart>
              <Pie
                data={staffByRole}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label
              >
                {staffByRole.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4 text-slate-800'>
            Attendance Trend
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart
              data={attendanceTrend}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' fontSize={12} />
              <YAxis unit='%' />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='Attendance Rate'
                stroke='#8884d8'
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4 text-slate-800'>
            Student Status Breakdown
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={studentByStatus}
              layout='vertical'
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis type='number' />
              <YAxis dataKey='name' type='category' width={80} />
              <Tooltip />
              <Bar dataKey='count' fill='#82ca9d' name='Number of Students'>
                {studentByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index + (1 % COLORS.length)]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;