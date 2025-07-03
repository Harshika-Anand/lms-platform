import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state for creating new assignment
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    course: "",
    type: "assignment",
    dueDate: "",
    points: 100,
    instructions: "",
    attachments: []
  });

  const courses = [
    "Introduction to Web Development",
    "Advanced React Concepts",
    "Database Design Principles"
  ];

  const assignmentTypes = [
    "assignment",
    "quiz", 
    "project",
    "exam",
    "discussion"
  ];

  // Mock assignment data
  const mockAssignments = [
    {
      id: 1,
      title: "HTML/CSS Portfolio Project",
      description: "Create a personal portfolio website using HTML and CSS",
      course: "Introduction to Web Development",
      type: "project",
      dueDate: "2024-07-15",
      points: 100,
      status: "published",
      submissionCount: 38,
      totalStudents: 45,
      createdAt: "2024-06-15",
      instructions: "Build a responsive portfolio website that showcases your skills...",
    },
    {
      id: 2,
      title: "React Components Quiz",
      description: "Test your understanding of React components and props",
      course: "Advanced React Concepts",
      type: "quiz",
      dueDate: "2024-07-10",
      points: 50,
      status: "published",
      submissionCount: 28,
      totalStudents: 28,
      createdAt: "2024-06-20",
      instructions: "Complete all questions about React components...",
    },
    {
      id: 3,
      title: "Database Schema Design",
      description: "Design a database schema for an e-commerce application",
      course: "Database Design Principles",
      type: "assignment",
      dueDate: "2024-07-20",
      points: 75,
      status: "draft",
      submissionCount: 0,
      totalStudents: 32,
      createdAt: "2024-07-01",
      instructions: "Create an ERD and SQL schema for an online store...",
    }
  ];

  useEffect(() => {
    setAssignments(mockAssignments);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesCourse = selectedCourse === "all" || assignment.course === selectedCourse;
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesStatus && matchesSearch;
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    
    const assignment = {
      id: Date.now(),
      ...newAssignment,
      status: "draft",
      submissionCount: 0,
      totalStudents: 45, // This would come from the selected course
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAssignments([assignment, ...assignments]);
    setNewAssignment({
      title: "",
      description: "",
      course: "",
      type: "assignment",
      dueDate: "",
      points: 100,
      instructions: "",
      attachments: []
    });
    setShowCreateForm(false);
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter(a => a.id !== assignmentId));
    }
  };

  const handlePublishAssignment = (assignmentId) => {
    setAssignments(assignments.map(a => 
      a.id === assignmentId ? { ...a, status: "published" } : a
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "quiz": return "❓";
      case "project": return "🛠️";
      case "exam": return "📋";
      case "discussion": return "💬";
      default: return "📝";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Create and manage assignments for your courses</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Create Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">{assignments.length}</h3>
          <p className="text-sm text-gray-600">Total Assignments</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {assignments.filter(a => a.status === "published").length}
          </h3>
          <p className="text-sm text-gray-600">Published</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-600">
            {assignments.filter(a => a.status === "draft").length}
          </h3>
          <p className="text-sm text-gray-600">Drafts</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-600">
            {assignments.reduce((sum, a) => sum + a.submissionCount, 0)}
          </h3>
          <p className="text-sm text-gray-600">Total Submissions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search assignments..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getTypeIcon(assignment.type)}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{assignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📚 {assignment.course}</span>
                  <span>📅 Due: {assignment.dueDate}</span>
                  <span>💯 {assignment.points} points</span>
                  <span>👥 {assignment.submissionCount}/{assignment.totalStudents} submitted</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {assignment.status === "draft" && (
                  <button
                    onClick={() => handlePublishAssignment(assignment.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Publish
                  </button>
                )}
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Edit
                </button>
                <Link
                  to={`/teacher/assignments/${assignment.id}/submissions`}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  View Submissions
                </Link>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Submission Progress</span>
                <span>{Math.round((assignment.submissionCount / assignment.totalStudents) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(assignment.submissionCount / assignment.totalStudents) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Instructions Preview */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{assignment.instructions}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Assignment</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., React Components Quiz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    required
                    value={newAssignment.course}
                    onChange={(e) => setNewAssignment({...newAssignment, course: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {assignmentTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({...newAssignment, points: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the assignment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions *
                </label>
                <textarea
                  required
                  rows={6}
                  value={newAssignment.instructions}
                  onChange={(e) => setNewAssignment({...newAssignment, instructions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed instructions for students..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Create Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCourse !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first assignment to get started"
            }
          </p>
          {(!searchTerm && selectedCourse === "all" && statusFilter === "all") && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Assignment
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Assignments;