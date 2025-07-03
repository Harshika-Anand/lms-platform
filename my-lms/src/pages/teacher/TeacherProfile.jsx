import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dataService from "../../services/dataService";
import EditProfileModal from "../../components/EditProfileModal";

function TeacherProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "Teacher") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    // Get teacher's analytics
    const teacherAnalytics = dataService.getInstructorAnalytics(currentUser.email);
    setAnalytics(teacherAnalytics);

    // Get teacher's courses
    const teacherCourses = dataService.getCoursesByInstructor(currentUser.email);
    setCourses(teacherCourses);

    // Get teacher's assignments
    const teacherAssignments = dataService.getAssignmentsByInstructor(currentUser.email);
    setAssignments(teacherAssignments);
  };

  const handleProfileUpdate = (updatedData) => {
    const updatedUser = dataService.updateUser(user.email, updatedData);
    if (updatedUser) {
      setUser(updatedUser);
      setIsEditModalOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const getPendingGrades = () => {
    return assignments.reduce((total, assignment) => {
      return total + assignment.submissions.filter(s => s.status === "pending").length;
    }, 0);
  };

  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
        {/* Profile Summary */}
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              user?.name?.charAt(0)
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-4">{user.name}</h2>
          <p className="text-sm text-gray-600">@{user.username}</p>
          <p className="text-sm text-gray-500 mt-2">{user.role}</p>
          <p className="text-xs text-gray-400">Joined {user.joined}</p>
        </div>

        {/* Profile Details */}
        <div className="md:w-2/3 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Basic Info</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Username:</span> {user.username}</p>
              <p><span className="font-medium">Bio:</span> {user.bio || "No bio yet."}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Teaching Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{analytics.totalStudents || 0}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{analytics.totalCourses || 0}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600">${analytics.totalRevenue || 0}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-yellow-600">{analytics.avgCompletionRate || 0}%</p>
                <p className="text-sm text-gray-600">Avg Completion Rate</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-indigo-600">{analytics.avgGrade || 0}%</p>
                <p className="text-sm text-gray-600">Avg Student Grade</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-600">{getPendingGrades()}</p>
                <p className="text-sm text-gray-600">Pending Grades</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
              Change Password
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Education</h4>
            <p className="text-sm text-gray-600">{user.education || "Not specified"}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Experience</h4>
            <p className="text-sm text-gray-600">{user.experience || "Not specified"}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Areas of Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {user.expertise && user.expertise.length > 0 ? (
                user.expertise.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">None specified</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Certifications</h4>
            <div className="space-y-1">
              {user.certifications && user.certifications.length > 0 ? (
                user.certifications.map((cert, index) => (
                  <p key={index} className="text-sm text-gray-600">• {cert}</p>
                ))
              ) : (
                <span className="text-sm text-gray-500">None specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Courses</h3>
        <div className="space-y-4">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-600">{course.enrolledStudents.length} students enrolled</p>
              </div>
              <div className="text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No courses created yet. Create your first course to get started!
            </div>
          )}
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Assignments</h3>
        <div className="space-y-4">
          {assignments.slice(0, 3).map((assignment) => {
            const pendingSubmissions = assignment.submissions.filter(s => s.status === "pending").length;
            return (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                  <p className="text-sm text-gray-600">{assignment.courseName}</p>
                  <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {assignment.submissions.length} submissions
                  </div>
                  {pendingSubmissions > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {pendingSubmissions} pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          
          {assignments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No assignments created yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}

export default TeacherProfile;