import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import dataService from "../../services/dataService";

function Enroll() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    // Get course details
    const courseData = dataService.getCourseById(courseId);
    if (!courseData) {
      toast.error("Course not found");
      navigate("/courses");
      return;
    }

    setCourse(courseData);

    // Check if already enrolled
    const enrollments = dataService.getEnrollmentsByStudent(currentUser.email);
    const isEnrolled = enrollments.some(enrollment => enrollment.courseId == courseId);
    setIsAlreadyEnrolled(isEnrolled);

    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!user || !course) return;

    setIsEnrolling(true);

    try {
      const success = dataService.enrollStudent(user.email, course.id);
      
      if (success) {
        toast.success(`Successfully enrolled in ${course.title}!`);
        navigate(`/course/${course.id}`);
      } else {
        toast.error("You are already enrolled in this course");
        setIsAlreadyEnrolled(true);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll in course");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleGoToCourse = () => {
    navigate(`/course/${course.id}`);
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-center">
        <div className="text-4xl mb-4">📚</div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-600 mb-6">The course you're trying to enroll in doesn't exist.</p>
        <button
          onClick={handleBackToCourses}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Course Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">
          {course.image || "📚"}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isAlreadyEnrolled ? `Welcome Back!` : `Enroll in ${course.title}`}
        </h1>
        <p className="text-gray-600">
          {isAlreadyEnrolled 
            ? "You're already enrolled in this course. Continue your learning journey!"
            : "Ready to start your learning journey?"
          }
        </p>
      </div>

      {/* Course Details */}
      <div className="space-y-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Course Overview</h2>
          <p className="text-gray-700 leading-relaxed">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Course Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Instructor:</span> {course.instructorName}</p>
              <p><span className="font-medium">Level:</span> {course.level}</p>
              <p><span className="font-medium">Duration:</span> {course.duration}</p>
              <p><span className="font-medium">Category:</span> {course.category}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Enrollment Info</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Students Enrolled:</span> {course.enrolledStudents.length}</p>
              <p><span className="font-medium">Price:</span> {course.price ? `$${course.price}` : "Free"}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  course.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {course.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        {course.objectives && course.objectives.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">What You'll Learn</h3>
            <ul className="space-y-2">
              {course.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {course.requirements && course.requirements.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Requirements</h3>
            <ul className="space-y-2">
              {course.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Course Syllabus Preview */}
        {course.syllabus && course.syllabus.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Course Curriculum</h3>
            <div className="space-y-3">
              {course.syllabus.map((module, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">{module.module}</h4>
                  <p className="text-sm text-gray-600">{module.topics.length} topics</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {isAlreadyEnrolled ? (
          <>
            <button
              onClick={handleGoToCourse}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Continue Learning
            </button>
            <button
              onClick={handleBackToCourses}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Browse More Courses
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEnroll}
              disabled={isEnrolling || course.status !== "published"}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnrolling ? "Enrolling..." : 
               course.status !== "published" ? "Course Not Available" :
               course.price ? `Enroll for $${course.price}` : "Enroll for Free"}
            </button>
            <button
              onClick={handleBackToCourses}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Back to Courses
            </button>
          </>
        )}
      </div>

      {/* Course Unavailable Message */}
      {course.status !== "published" && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> This course is currently {course.status} and not available for enrollment.
          </p>
        </div>
      )}
    </div>
  );
}

export default Enroll;