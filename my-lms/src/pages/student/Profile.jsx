import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dataService from "../../services/dataService";
import EditProfileModal from "../../components/EditProfileModal";

function StudentProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    // Get student's enrollments
    const studentEnrollments = dataService.getEnrollmentsByStudent(currentUser.email);
    setEnrollments(studentEnrollments);

    // Get student's assignments
    const studentAssignments = dataService.getAssignmentsByStudent(currentUser.email);
    setAssignments(studentAssignments);

    // Get analytics
    const studentAnalytics = dataService.getStudentAnalytics(currentUser.email);
    setAnalytics(studentAnalytics);
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

  const getSubmissionStats = () => {
    let submitted = 0;
    let graded = 0;
    let totalGradePoints = 0;
    let gradedAssignments = 0;

    assignments.forEach(assignment => {
      const submission = assignment.submissions.find(s => s.studentId === user.email);
      if (submission) {
        submitted++;
        if (submission.status === "graded" && submission.grade !== null) {
          graded++;
          totalGradePoints += submission.grade;
          gradedAssignments++;
        }
      }
    });

    return {
      submitted,
      graded,
      averageGrade: gradedAssignments > 0 ? Math.round(totalGradePoints / gradedAssignments) : 0
    };
  };

  const submissionStats = getSubmissionStats();

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
            {user?.name?.charAt(0)}
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{analytics.totalCourses || 0}</p>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{analytics.completedCourses || 0}</p>
                <p className="text-sm text-gray-600">Completed Courses</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600">{analytics.completedCourses || 0}</p>
                <p className="text-sm text-gray-600">Certificates Earned</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Academic Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-yellow-600">{analytics.avgProgress || 0}%</p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-indigo-600">{submissionStats.averageGrade}%</p>
                <p className="text-sm text-gray-600">Avg Grade</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-600">{submissionStats.submitted}</p>
                <p className="text-sm text-gray-600">Assignments Submitted</p>
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

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {enrollments.slice(0, 3).map((enrollment) => (
            <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{enrollment.courseName}</h4>
                <p className="text-sm text-gray-600">Progress: {enrollment.progress}%</p>
              </div>
              <div className="text-sm text-gray-500">
                Last accessed: {enrollment.lastAccessed}
              </div>
            </div>
          ))}
          
          {enrollments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No enrolled courses yet. Browse courses to get started!
            </div>
          )}
        </div>
      </div>

      {/* Current Assignments */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Assignments</h3>
        <div className="space-y-4">
          {assignments.slice(0, 3).map((assignment) => {
            const submission = assignment.submissions.find(s => s.studentId === user.email);
            return (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                  <p className="text-sm text-gray-600">{assignment.courseName}</p>
                  <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                </div>
                <div className="text-right">
                  {submission ? (
                    <div>
                      {submission.status === "graded" && (
                        <div className="text-lg font-bold text-green-600">{submission.grade}%</div>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        submission.status === "graded" ? "bg-green-100 text-green-800" :
                        submission.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {submission.status === "graded" ? "Graded" : "Submitted"}
                      </span>
                    </div>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Not Submitted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          
          {assignments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No assignments available yet.
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

export default StudentProfile;