import React, { useState, useEffect } from "react";

function Analytics() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [timeRange, setTimeRange] = useState("month");
  const [analytics, setAnalytics] = useState({
    overview: {
      totalStudents: 105,
      activeStudents: 89,
      courseCompletionRate: 73,
      averageGrade: 85,
      totalRevenue: 5420,
      newEnrollments: 23
    },
    coursePerformance: [
      {
        course: "Introduction to Web Development",
        students: 45,
        completionRate: 78,
        averageGrade: 87,
        revenue: 2250,
        satisfaction: 4.6
      },
      {
        course: "Advanced React Concepts", 
        students: 28,
        completionRate: 82,
        averageGrade: 91,
        revenue: 1960,
        satisfaction: 4.8
      },
      {
        course: "Database Design Principles",
        students: 32,
        completionRate: 59,
        averageGrade: 79,
        revenue: 1210,
        satisfaction: 4.2
      }
    ],
    studentEngagement: {
      weeklyActive: [65, 72, 68, 71, 78, 82, 85],
      dailyLogins: [12, 18, 15, 22, 19, 25, 28],
      averageSessionTime: "24 minutes",
      forumPosts: 156,
      assignmentSubmissions: 89
    },
    revenueData: {
      monthly: [1200, 1450, 1800, 2100, 1950, 2200],
      courseRevenue: [
        { name: "Web Dev", value: 2250 },
        { name: "React", value: 1960 },
        { name: "Database", value: 1210 }
      ]
    }
  });

  const courses = [
    "Introduction to Web Development",
    "Advanced React Concepts",
    "Database Design Principles"
  ];

  const StatCard = ({ title, value, subtitle, change, icon, color = "blue" }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className={`text-2xl font-semibold text-${color}-600`}>{value}</p>
            {change && (
              <span className={`ml-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`text-3xl text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color = "blue" }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-600 h-2 rounded-full transition-all`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title, type = "bar" }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.name || `Week ${index + 1}`}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your teaching performance and student engagement</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-4">
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
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={analytics.overview.totalStudents}
          subtitle={`${analytics.overview.activeStudents} active`}
          change={12}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics.overview.courseCompletionRate}%`}
          subtitle="Across all courses"
          change={5}
          icon="🎓"
          color="green"
        />
        <StatCard
          title="Average Grade"
          value={`${analytics.overview.averageGrade}%`}
          subtitle="Student performance"
          change={-2}
          icon="📊"
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`$${analytics.overview.totalRevenue.toLocaleString()}`}
          subtitle="This month"
          change={18}
          icon="💰"
          color="yellow"
        />
        <StatCard
          title="New Enrollments"
          value={analytics.overview.newEnrollments}
          subtitle="This month"
          change={25}
          icon="📈"
          color="indigo"
        />
        <StatCard
          title="Course Rating"
          value="4.6"
          subtitle="Average satisfaction"
          change={3}
          icon="⭐"
          color="orange"
        />
      </div>

      {/* Course Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
          <div className="space-y-4">
            {analytics.coursePerformance.map((course, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">{course.course}</h4>
                  <span className="text-sm text-gray-500">{course.students} students</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Completion Rate</p>
                    <p className="text-lg font-semibold text-green-600">{course.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Avg Grade</p>
                    <p className="text-lg font-semibold text-blue-600">{course.averageGrade}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-sm font-medium text-gray-900">${course.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Rating</p>
                    <p className="text-sm font-medium text-gray-900">⭐ {course.satisfaction}/5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Engagement</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Weekly Active Students</h4>
              <div className="flex items-end gap-1 h-16">
                {analytics.studentEngagement.weeklyActive.map((value, index) => (
                  <div
                    key={index}
                    className="bg-blue-600 rounded-t flex-1"
                    style={{ height: `${(value / Math.max(...analytics.studentEngagement.weeklyActive)) * 100}%` }}
                    title={`Week ${index + 1}: ${value} students`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>7 days ago</span>
                <span>Today</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-blue-600">{analytics.studentEngagement.averageSessionTime}</p>
                <p className="text-xs text-gray-600">Avg Session Time</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-green-600">{analytics.studentEngagement.forumPosts}</p>
                <p className="text-xs text-gray-600">Forum Posts</p>
              </div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-2xl font-bold text-purple-600">{analytics.studentEngagement.assignmentSubmissions}</p>
              <p className="text-xs text-gray-600">Assignment Submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleChart
          data={analytics.revenueData.monthly.map((value, index) => ({
            name: `Month ${index + 1}`,
            value
          }))}
          title="Monthly Revenue Trend"
        />
        
        <SimpleChart
          data={analytics.revenueData.courseRevenue}
          title="Revenue by Course"
        />
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Top Performing Areas</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Student engagement increased by 25%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Course completion rates improved</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Revenue growth exceeding targets</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Areas for Improvement</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Database course needs attention</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Assignment submission rates could be higher</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Consider more interactive content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;