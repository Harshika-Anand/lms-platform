import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dataService from "../../services/dataService";

function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "Teacher") return;
    
    setUser(currentUser);

    // Get teacher's courses
    const teacherCourses = dataService.getCoursesByInstructor(currentUser.email);
    setCourses(teacherCourses);

    // Get analytics
    const analyticsData = dataService.getInstructorAnalytics(currentUser.email);
    setAnalytics(analyticsData);

    // Get recent activity
    const activity = generateRecentActivity(currentUser.email);
    setRecentActivity(activity);

    // Get pending tasks
    const tasks = generatePendingTasks(currentUser.email);
    setPendingTasks(tasks);
  };

  const generateRecentActivity = (instructorId) => {
    const enrollments = dataService.getEnrollmentsByInstructor(instructorId);
    const assignments = dataService.getAssignmentsByInstructor(instructorId);
    
    const activities = [];

    // Recent enrollments
    enrollments
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 3)
      .forEach(enrollment => {
        activities.push({
          type: "enrollment",
          message: `${enrollment.studentName} enrolled in ${enrollment.courseName}`,
          time: enrollment.enrolledAt,
          icon: "👨‍🎓"
        });
      });

    // Recent submissions
    assignments.forEach(assignment => {
      assignment.submissions
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 2)
        .forEach(submission => {
          activities.push({
            type: "submission",
            message: `${submission.studentName} submitted ${assignment.title}`,
            time: submission.submittedAt,
            icon: "📝"
          });
        });
    });

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };

  const generatePendingTasks = (instructorId) => {
    const assignments = dataService.getAssignmentsByInstructor(instructorId);
    const tasks = [];

    assignments.forEach(assignment => {
      const pendingSubmissions = assignment.submissions.filter(s => s.status === "pending");
      if (pendingSubmissions.length > 0) {
        tasks.push({
          type: "grading",
          message: `Grade ${pendingSubmissions.length} submissions for ${assignment.title}`,
          count: pendingSubmissions.length,
          link: `/teacher/grades`,
          priority: "high"
        });
      }
    });

    // Check for draft courses
    const draftCourses = courses.filter(c => c.status === "draft");
    if (draftCourses.length > 0) {
      tasks.push({
        type: "publish",
        message: `${draftCourses.length} draft courses ready to publish`,
        count: draftCourses.length,
        link: `/teacher/courses`,
        priority: "medium"
      });
    }

    return tasks.slice(0, 5);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
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

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || "Teacher"}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalStudents || 0}</p>
              <p className="text-sm text-gray-500">{analytics.activeStudents || 0} active</p>
            </div>
            <div className="text-3xl text-blue-500">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-green-600">{analytics.totalCourses || 0}</p>
              <p className="text-sm text-gray-500">{analytics.activeCourses || 0} published</p>
            </div>
            <div className="text-3xl text-green-500">📚</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Grades</p>
              <p className="text-2xl font-bold text-orange-600">{analytics.pendingGrades || 0}</p>
              <p className="text-sm text-gray-500">Need review</p>
            </div>
            <div className="text-3xl text-orange-500">📝</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">${analytics.totalRevenue || 0}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="text-3xl text-purple-500">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* My Courses */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
            <Link
              to="/teacher/courses"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {courses.slice(0, 3).map((course) => {
              const enrolledCount = course.enrolledStudents?.length || 0;
              const assignments = dataService.getAssignmentsByCourse(course.id);
              const pendingGrades = assignments.reduce((sum, a) => 
                sum + a.submissions.filter(s => s.status === "pending").length, 0
              );

              return (
                <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <span>👨‍🎓 {enrolledCount} students</span>
                    <span>📝 {pendingGrades} to grade</span>
                    <span>💰 ${course.price || 0}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/teacher/course/${course.id}`}
                      className="flex-1 bg-blue-100 text-blue-700 text-center py-1 rounded text-sm hover:bg-blue-200"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/teacher/analytics?course=${course.id}`}
                      className="flex-1 bg-green-100 text-green-700 text-center py-1 rounded text-sm hover:bg-green-200"
                    >
                      Analytics
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {courses.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-4">Create your first course to get started</p>
                <Link
                  to="/teacher/create-course"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Course
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
              to="/teacher/create-course"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <span>➕</span>
              Create New Course
            </Link>
            <Link
              to="/teacher/assignments"
              className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 flex items-center justify-center gap-2"
            >
              <span>📝</span>
              Create Assignment
            </Link>
            <Link
              to="/teacher/students"
              className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200 flex items-center justify-center gap-2"
            >
              <span>👥</span>
              View Students
            </Link>
            <Link
              to="/teacher/analytics"
              className="w-full bg-orange-100 text-orange-700 py-2 px-4 rounded-md hover:bg-orange-200 flex items-center justify-center gap-2"
            >
              <span>📊</span>
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pending Tasks</h2>
            {pendingTasks.length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {pendingTasks.length}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.message}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority} priority
                    </span>
                  </div>
                  <Link
                    to={task.link}
                    className="ml-3 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-gray-600">All caught up! No pending tasks.</p>
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
                <p className="text-gray-600">No recent activity to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Performance Summary */}
      {courses.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Performance Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(analytics.avgCompletionRate || 0)}%
              </div>
              <div className="text-sm text-gray-600">Avg Completion Rate</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(analytics.avgGrade || 0)}%
              </div>
              <div className="text-sm text-gray-600">Avg Student Grade</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length || 0}
              </div>
              <div className="text-sm text-gray-600">Avg Course Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;