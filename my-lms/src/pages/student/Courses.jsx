import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dataService from "../../services/dataService";
import SearchAndFilter from "../../components/SearchAndFilter";
import toast from "react-hot-toast";

function Courses() {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);
  const [user, setUser] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);

    if (!currentUser) return;

    // Get all published courses
    const courses = dataService.getAllCourses().filter(course => course.status === "published");
    setAllCourses(courses);
    setFilteredCourses(courses);

    // Get user's enrollments
    const userEnrollments = dataService.getEnrollmentsByStudent(currentUser.email);
    setEnrolledCourses(userEnrollments);
  };

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    let filtered = [...allCourses];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructorName.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Apply level filter
    if (filters.level && filters.level !== "all") {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    // Apply rating filter
    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(course => (course.rating || 0) >= filters.rating);
    }

    // Apply duration filter
    if (filters.duration && filters.duration !== "all") {
      filtered = filtered.filter(course => {
        const duration = parseInt(course.duration) || 0;
        switch (filters.duration) {
          case "short": return duration < 20;
          case "medium": return duration >= 20 && duration <= 50;
          case "long": return duration > 50;
          default: return true;
        }
      });
    }

    // Apply enrollment filter
    if (showEnrolledOnly) {
      const enrolledCourseIds = enrolledCourses.map(e => e.courseId);
      filtered = filtered.filter(course => enrolledCourseIds.includes(course.id));
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "popular":
            return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0);
          case "title":
            return a.title.localeCompare(b.title);
          case "duration":
            return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
          default:
            return 0;
        }
      });
    }

    setFilteredCourses(filtered);
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(enrollment => enrollment.courseId === courseId);
  };

  const getEnrollmentProgress = (courseId) => {
    const enrollment = enrolledCourses.find(e => e.courseId === courseId);
    return enrollment ? enrollment.progress : 0;
  };

  const handleEnroll = (courseId) => {
    if (!user) {
      toast.error("Please log in to enroll");
      return;
    }

    const success = dataService.enrollStudent(user.email, courseId);
    if (success) {
      toast.success("Successfully enrolled in course!");
      loadData(); // Reload data to update enrollment status
    } else {
      toast.error("Already enrolled in this course");
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 30) return "bg-red-500";
    if (progress < 60) return "bg-yellow-500";
    if (progress < 90) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {showEnrolledOnly ? "My Courses" : "All Courses"}
        </h1>
        <p className="text-gray-600 mt-1">
          {showEnrolledOnly 
            ? "Continue your learning journey" 
            : "Discover new courses and enhance your skills"
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-600">{enrolledCourses.length}</h3>
          <p className="text-sm text-gray-600">Enrolled Courses</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-600">
            {enrolledCourses.filter(e => e.progress === 100).length}
          </h3>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-orange-600">
            {enrolledCourses.filter(e => e.progress > 0 && e.progress < 100).length}
          </h3>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-purple-600">
            {Math.round(enrolledCourses.reduce((sum, e) => sum + e.progress, 0) / enrolledCourses.length) || 0}%
          </h3>
          <p className="text-sm text-gray-600">Avg Progress</p>
        </div>
      </div>

      {/* Search and Filter Component */}
      <SearchAndFilter 
        onFilterChange={handleFilterChange}
        currentFilters={currentFilters}
      />

      {/* Show Enrolled Only Toggle */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowEnrolledOnly(!showEnrolledOnly);
            // Re-apply filters when toggling
            handleFilterChange(currentFilters);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            showEnrolledOnly
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {showEnrolledOnly ? "Show All Courses" : "Show My Courses Only"}
        </button>
        
        {filteredCourses.length !== allCourses.length && (
          <span className="ml-3 text-sm text-gray-600">
            Showing {filteredCourses.length} of {allCourses.length} courses
          </span>
        )}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const enrolled = isEnrolled(course.id);
          const progress = getEnrollmentProgress(course.id);
          
          return (
            <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                {course.image ? (
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-4xl">
                    📚
                  </div>
                )}
                
                {/* Level Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.level === "Beginner" ? "bg-green-100 text-green-800" :
                    course.level === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {course.level}
                  </span>
                </div>

                {/* Enrollment Status */}
                {enrolled && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Enrolled
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                {/* Course Info */}
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {course.description}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    By {course.instructorName}
                  </p>
                </div>

                {/* Course Details */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>📚 {course.category}</span>
                  <span>⏱️ {course.duration}</span>
                  <span>👥 {course.enrolledStudents?.length || 0}</span>
                </div>

                {/* Progress Bar (if enrolled) */}
                {enrolled && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {course.rating > 0 && (
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm text-gray-600 ml-1">{course.rating} ({course.reviews?.length || 0} reviews)</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {enrolled ? (
                    <>
                      <Link
                        to={`/course/${course.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 text-sm"
                      >
                        {progress === 0 ? "Start Course" : "Continue"}
                      </Link>
                      <Link
                        to={`/course/${course.id}/assignments`}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                        title="View Assignments"
                      >
                        📝
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
                      >
                        Enroll Now
                      </button>
                      <Link
                        to={`/enroll/${course.id}`}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                        title="Course Details"
                      >
                        👁️
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more courses
          </p>
          <button
            onClick={() => {
              setCurrentFilters({});
              setShowEnrolledOnly(false);
              setFilteredCourses(allCourses);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;