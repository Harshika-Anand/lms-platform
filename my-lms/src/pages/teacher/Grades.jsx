import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Grades() {
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock assignment data with student submissions
  const mockAssignments = [
    {
      id: 1,
      title: "HTML/CSS Portfolio Project",
      course: "Introduction to Web Development",
      dueDate: "2024-07-10",
      totalStudents: 45,
      submittedCount: 38,
      gradedCount: 25,
      avgGrade: 87,
      submissions: [
        {
          studentId: 1,
          studentName: "Alice Johnson",
          submittedAt: "2024-07-09",
          status: "graded",
          grade: 92,
          feedback: "Excellent work! Clean code and great design."
        },
        {
          studentId: 2,
          studentName: "Bob Smith",
          submittedAt: "2024-07-10",
          status: "pending",
          grade: null,
          feedback: ""
        },
        {
          studentId: 3,
          studentName: "Carol Davis",
          submittedAt: "2024-07-08",
          status: "graded",
          grade: 88,
          feedback: "Good work, but could improve accessibility."
        }
      ]
    },
    {
      id: 2,
      title: "React Components Quiz",
      course: "Advanced React Concepts",
      dueDate: "2024-07-05",
      totalStudents: 28,
      submittedCount: 28,
      gradedCount: 15,
      avgGrade: 82,
      submissions: [
        {
          studentId: 4,
          studentName: "David Wilson",
          submittedAt: "2024-07-05",
          status: "pending",
          grade: null,
          feedback: ""
        },
        {
          studentId: 1,
          studentName: "Alice Johnson",
          submittedAt: "2024-07-04",
          status: "graded",
          grade: 95,
          feedback: "Perfect understanding of React concepts!"
        }
      ]
    }
  ];

  const courses = [
    "Introduction to Web Development",
    "Advanced React Concepts",
    "Database Design Principles"
  ];

  useEffect(() => {
    setAssignments(mockAssignments);
  }, []);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradingStudent, setGradingStudent] = useState(null);
  const [currentGrade, setCurrentGrade] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState("");

  const filteredAssignments = assignments.filter(assignment => {
    const matchesCourse = selectedCourse === "all" || assignment.course === selectedCourse;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "pending") {
      return matchesCourse && matchesSearch && (assignment.submittedCount > assignment.gradedCount);
    } else if (statusFilter === "completed") {
      return matchesCourse && matchesSearch && (assignment.submittedCount === assignment.gradedCount);
    }
    return matchesCourse && matchesSearch;
  });

  const handleGradeSubmission = (assignment, student) => {
    setSelectedAssignment(assignment);
    setGradingStudent(student);
    setCurrentGrade(student.grade || "");
    setCurrentFeedback(student.feedback || "");
  };

  const saveGrade = () => {
    if (!currentGrade || !gradingStudent) return;

    const updatedAssignments = assignments.map(assignment => {
      if (assignment.id === selectedAssignment.id) {
        const updatedSubmissions = assignment.submissions.map(submission => {
          if (submission.studentId === gradingStudent.studentId) {
            return {
              ...submission,
              grade: parseInt(currentGrade),
              feedback: currentFeedback,
              status: "graded"
            };
          }
          return submission;
        });

        const gradedCount = updatedSubmissions.filter(s => s.status === "graded").length;
        const avgGrade = updatedSubmissions
          .filter(s => s.grade !== null)
          .reduce((sum, s) => sum + s.grade, 0) / gradedCount || 0;

        return {
          ...assignment,
          submissions: updatedSubmissions,
          gradedCount,
          avgGrade: Math.round(avgGrade)
        };
      }
      return assignment;
    });

    setAssignments(updatedAssignments);
    setSelectedAssignment(null);
    setGradingStudent(null);
    setCurrentGrade("");
    setCurrentFeedback("");
  };

  const getStatusColor = (pendingCount) => {
    if (pendingCount === 0) return "bg-green-100 text-green-800";
    if (pendingCount <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Grades & Assessment</h1>
        <p className="text-gray-600 mt-1">Review and grade student submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">{assignments.length}</h3>
          <p className="text-sm text-gray-600">Total Assignments</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-600">
            {assignments.reduce((sum, a) => sum + (a.submittedCount - a.gradedCount), 0)}
          </h3>
          <p className="text-sm text-gray-600">Pending Reviews</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {assignments.reduce((sum, a) => sum + a.gradedCount, 0)}
          </h3>
          <p className="text-sm text-gray-600">Graded Submissions</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-600">
            {Math.round(assignments.reduce((sum, a) => sum + a.avgGrade, 0) / assignments.length) || 0}%
          </h3>
          <p className="text-sm text-gray-600">Average Grade</p>
        </div>
      </div>

      {/* Filters */}
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
              <option value="pending">Pending Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const pendingCount = assignment.submittedCount - assignment.gradedCount;
          
          return (
            <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.course}</p>
                  <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pendingCount)}`}>
                    {pendingCount} pending
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{assignment.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{assignment.submittedCount}</div>
                  <div className="text-sm text-gray-600">Submitted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{assignment.gradedCount}</div>
                  <div className="text-sm text-gray-600">Graded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{assignment.avgGrade}%</div>
                  <div className="text-sm text-gray-600">Avg Grade</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Grading Progress</span>
                  <span>{Math.round((assignment.gradedCount / assignment.submittedCount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(assignment.gradedCount / assignment.submittedCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Submissions */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Recent Submissions</h4>
                <div className="space-y-2">
                  {assignment.submissions.slice(0, 3).map((submission) => (
                    <div key={submission.studentId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{submission.studentName}</div>
                        <div className="text-sm text-gray-600">
                          Submitted: {submission.submittedAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {submission.status === "graded" ? (
                          <span className="text-lg font-semibold text-green-600">
                            {submission.grade}%
                          </span>
                        ) : (
                          <span className="text-sm text-orange-600 font-medium">Pending</span>
                        )}
                        <button
                          onClick={() => handleGradeSubmission(assignment, submission)}
                          className={`px-3 py-1 rounded text-sm ${
                            submission.status === "graded"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          }`}
                        >
                          {submission.status === "graded" ? "Edit Grade" : "Grade Now"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {assignment.submissions.length > 3 && (
                  <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                    View all {assignment.submissions.length} submissions →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grading Modal */}
      {selectedAssignment && gradingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Grade: {selectedAssignment.title}
            </h3>
            <p className="text-gray-600 mb-4">Student: {gradingStudent.studentName}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  value={currentFeedback}
                  onChange={(e) => setCurrentFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide constructive feedback..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveGrade}
                disabled={!currentGrade}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Save Grade
              </button>
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setGradingStudent(null);
                  setCurrentGrade("");
                  setCurrentFeedback("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCourse !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create assignments in your courses to start grading"
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default Grades;