import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Mock student data
  const mockStudents = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@email.com",
      avatar: "AJ",
      enrolledCourses: ["Introduction to Web Development", "Advanced React Concepts"],
      totalCourses: 2,
      completedCourses: 1,
      averageGrade: 92,
      lastActivity: "2 hours ago",
      joinDate: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@email.com",
      avatar: "BS",
      enrolledCourses: ["Introduction to Web Development"],
      totalCourses: 1,
      completedCourses: 0,
      averageGrade: 78,
      lastActivity: "1 day ago",
      joinDate: "2024-02-10",
      status: "active"
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@email.com",
      avatar: "CD",
      enrolledCourses: ["Advanced React Concepts", "Database Design Principles"],
      totalCourses: 2,
      completedCourses: 1,
      averageGrade: 88,
      lastActivity: "3 days ago",
      joinDate: "2023-12-05",
      status: "active"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@email.com",
      avatar: "DW",
      enrolledCourses: ["Database Design Principles"],
      totalCourses: 1,
      completedCourses: 0,
      averageGrade: 65,
      lastActivity: "1 week ago",
      joinDate: "2024-03-01",
      status: "inactive"
    }
  ];

  const courses = [
    "Introduction to Web Development",
    "Advanced React Concepts", 
    "Database Design Principles"
  ];

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || 
                         student.enrolledCourses.includes(selectedCourse);
    return matchesSearch && matchesCourse;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "grade":
        return b.averageGrade - a.averageGrade;
      case "courses":
        return b.totalCourses - a.totalCourses;
      case "joinDate":
        return new Date(b.joinDate) - new Date(a.joinDate);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-1">Manage and track your students' progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">{students.length}</h3>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {students.filter(s => s.status === "active").length}
          </h3>
          <p className="text-sm text-gray-600">Active Students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-600">
            {Math.round(students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length) || 0}%
          </h3>
          <p className="text-sm text-gray-600">Average Grade</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-orange-600">
            {students.reduce((sum, s) => sum + s.completedCourses, 0)}
          </h3>
          <p className="text-sm text-gray-600">Total Completions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="grade">Sort by Grade</option>
              <option value="courses">Sort by Courses</option>
              <option value="joinDate">Sort by Join Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {student.avatar}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.totalCourses} enrolled
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.completedCourses} completed
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${getGradeColor(student.averageGrade)}`}>
                      {student.averageGrade}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        View Profile
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Message
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {sortedStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍🎓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCourse !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Students will appear here when they enroll in your courses"
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default Students;