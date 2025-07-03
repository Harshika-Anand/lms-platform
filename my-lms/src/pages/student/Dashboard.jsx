import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import dataService from "../../services/dataService";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "Student") {
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

    // Generate recent activity
    const activity = generateRecentActivity(currentUser.email);
    setRecentActivity(activity);
  };

  const generateRecentActivity = (studentId) => {
    const activities = [];

    // Recent enrollments
    enrollments
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 2)
      .forEach(enrollment => {
        activities.push({
          type: "enrollment",
          message: `Enrolled in ${enrollment.courseName}`,
          time: enrollment.enrolledAt,
          icon: "📚"
        });
      });

    // Recent submissions
    assignments.forEach(assignment => {
      const submission = assignment.submissions.find(s => s.studentId === studentId);
      if (submission) {
        activities.push({
          type: "submission",
          message: `Submitted ${assignment.title}`,
          time: submission.submittedAt,
          icon: "📝"
        });
      }
    });

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };

  const handleContinueCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const updateProgress = (courseId, newProgress) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const enrollment = enrollments.find(e => e.courseId === courseId);
    
    if (enrollment) {
      const newCompletedLessons = Math.round((newProgress / 100) * enrollment.totalLessons);
      dataService.updateEnrollmentProgress(currentUser.email, courseId, newProgress, newCompletedLessons);
      
      // Update local state
      setEnrollments(prev => 
        prev.map(e => 
          e.courseId === courseId 
            ? { ...e, progress: newProgress, completedLessons: newCompletedLessons }
            : e
        )
      );
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-gray-400";
    if (progress < 30) return "bg-red-500";
    if (progress < 60) return "bg-yellow-500";
    if (progress < 90) return "bg-blue-500";
    return "bg-green-500";
  };

  const getUpcomingAssignments = () => {
    const upcoming = [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    assignments.forEach(assignment => {
      const submission = assignment.submissions.find(s => s.studentId === currentUser.email);
      if (!submission) {
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue >= 0) {
          upcoming.push({
            ...assignment,
            daysUntilDue
          });
        }
      }
    });
    
    return upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue).slice(0, 3);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100);
  const upcomingAssignments = getUpcomingAssignments();

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalCourses || 0}</p>
              <p className="text-sm text-gray-500">{analytics.activeCourses || 0} active</p>
            </div>
            <div className="text-3xl text-blue-500">📚</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{analytics.completedCourses || 0}</p>
              <p className="text-sm text-gray-500">Courses finished</p>
            </div>
            <div className="text-3xl text-green-500">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.avgGrade || 0}%</p>
              <p className="text-sm text-gray-500">Across assignments</p>
            </div>
            <div className="text-3xl text-purple-500">📊</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-orange-600">{analytics.avgProgress || 0}%</p>
              <p className="text-sm text-gray-500">Average completion</p>
            </div>
            <div className="text-3xl text-orange-500">⚡</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Courses →
            </Link>
          </div>
          
          <div className="space-y-4">
            {inProgressCourses.length > 0 ? (
              inProgressCourses.slice(0, 3).map((enrollment) => (
                <div key={enrollment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{enrollment.courseName}</h3>
                      <p className="text-sm text-gray-600">
                        {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {enrollment.progress}% complete
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(enrollment.progress)}`}
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Last accessed: {formatTimeAgo(enrollment.lastAccessed)}
                    </span>
                    <button
                      onClick={() => handleContinueCourse(enrollment.courseId)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses in progress</h3>
                <p className="text-gray-600 mb-4">Start learning by enrolling in a course</p>
                <Link
                  to="/courses"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/courses"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <span>📚</span>
              Browse Courses
            </Link>
            <Link
              to="/certificates"
              className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 flex items-center justify-center gap-2"
            >
              <span>🎓</span>
              View Certificates
            </Link>
            <Link
              to="/profile"
              className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200 flex items-center justify-center gap-2"
            >
              <span>👤</span>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
            {upcomingAssignments.length > 0 && (
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                {upcomingAssignments.length}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.courseName}</p>
                    <p className="text-xs text-gray-500">
                      Due: {assignment.dueDate} • {assignment.points} points
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.daysUntilDue <= 1 ? "bg-red-100 text-red-800" :
                      assignment.daysUntilDue <= 3 ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {assignment.daysUntilDue === 0 ? "Due today" :
                       assignment.daysUntilDue === 1 ? "Due tomorrow" :
                       `${assignment.daysUntilDue} days`
                      }
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-gray-600">No upcoming assignments</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-gray-600">No recent activity to show</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learning Progress Summary */}
      {enrollments.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Progress Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)}%
              </div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {enrollments.reduce((sum, e) => sum + e.completedLessons, 0)}
              </div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {enrollments.reduce((sum, e) => sum + e.totalLessons, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;