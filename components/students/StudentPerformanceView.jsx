"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentPerformanceView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [studentsRes, departmentsRes, coursesRes] = await Promise.all([
          fetch("/api/student-performance"),
          fetch("/api/departments"),
          fetch("/api/courses"),
        ]);

        if (!studentsRes.ok) throw new Error("Failed to fetch student performance");
        if (!departmentsRes.ok) throw new Error("Failed to fetch departments");
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");

        const studentsData = await studentsRes.json();
        const departmentsData = await departmentsRes.json();
        const coursesData = await coursesRes.json();

        setStudents(studentsData);
        setDepartments(departmentsData);
        setCourses(coursesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students.filter(student =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedDepartment) {
      filtered = filtered.filter(student => student.departmentId === selectedDepartment);
    }

    if (selectedCourse) {
      filtered = filtered.filter(student => student.courseId === selectedCourse);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [students, searchQuery, selectedDepartment, selectedCourse, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border rounded"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedAndFilteredStudents}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="firstName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageGrade" fill="#8884d8" name="Average Grade" />
            <Bar dataKey="attendanceRate" fill="#82ca9d" name="Attendance Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('firstName')}>Name</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('averageGrade')}>Average Grade</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('attendanceRate')}>Attendance Rate</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('completedAssignments')}>Completed Assignments</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('averageAssignmentGrade')}>Avg. Assignment Grade</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('averageExamGrade')}>Avg. Exam Grade</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="py-2 px-4 border-b">{`${student.firstName} ${student.lastName}`}</td>
                <td className="py-2 px-4 border-b">{student.averageGrade}%</td>
                <td className="py-2 px-4 border-b">{student.attendanceRate}%</td>
                <td className="py-2 px-4 border-b">{student.completedAssignments}</td>
                <td className="py-2 px-4 border-b">{student.averageAssignmentGrade}%</td>
                <td className="py-2 px-4 border-b">{student.averageExamGrade}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPerformanceView;
