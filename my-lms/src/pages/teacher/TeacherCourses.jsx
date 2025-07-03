import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dummyCourses } from "../../data/teacherData";

function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get courses from localStorage or use dummy data
    const storedCourses = JSON.parse(localStorage.getItem("teacherCourses") || "[]");
    const allCourses = [...dummyCourses, ...storedCourses];
    setCourses(allCourses);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "all" || course.status === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      
      // Update localStorage
      const storedCourses = JSON.parse(localStorage.getItem("teacherCourses") || "[]");
      const updatedStoredCourses = storedCourses.filter(course => course.id !== courseId);
      localStorage.setItem("teacherCourses", JSON.stringify(updatedStoredCourses));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage and track your courses</p>
        </div>
        <Link
          to="/teacher/create-course"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Create New Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">{courses.length}</h3>
          <p className="text-sm text-gray-600">Total Courses</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {courses.filter(c => c.status === "active").length}
          </h3>
          <p className="text-sm text-gray-600">Active Courses</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-600">
            {courses.reduce((sum, c) => sum + (c.students || 0), 0)}
          </h3>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-orange-600">
            {courses.reduce((sum, c) => sum + (c.pendingGrades || 0), 0)}
          </h3>
          <p className="text-sm text-gray-600">Pending Grades</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "draft", "completed"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            {/* Course Image */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
              {course.image ? (
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="text-white text-4xl">📚</div>
              )}
            </div>

            <div className="p-4">
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => console.log("Edit course", course.id)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit course"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete course"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Course Info */}
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>👨‍🎓 {course.students || 0} students</span>
                <span>📝 {course.pendingGrades || 0} to grade</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{course.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/teacher/course/${course.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Manage
                </Link>
                {course.status === "active" && (
                  <Link
                    to={`/teacher/course/${course.id}/analytics`}
                    className="flex-1 bg-gray-600 text-white text-center py-2 rounded-md hover:bg-gray-700 text-sm"
                  >
                    Analytics
                  </Link>
                )}
              </div>

              {/* Last Updated */}
              <p className="text-xs text-gray-400 mt-2">
                Updated {course.lastUpdated || "recently"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filter !== "all" ? "No courses found" : "No courses yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filter !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create your first course to get started"
            }
          </p>
          {(!searchTerm && filter === "all") && (
            <Link
              to="/teacher/create-course"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Course
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default TeacherCourses;