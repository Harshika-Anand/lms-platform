import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import dataService from '../../services/dataService';
import { StarRating, CourseRating, CourseReviews } from '../../components/CourseRating';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasCompletedToastShown, setHasCompletedToastShown] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [courseStats, setCourseStats] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Get course details
    const courseData = dataService.getCourseById(id);
    if (!courseData) {
      setLoading(false);
      return;
    }

    // Get enrollment data
    const enrollmentData = dataService.getEnrollmentsByStudent(currentUser.email)
      .find(e => e.courseId == id);
    
    if (!enrollmentData) {
      setLoading(false);
      return;
    }

    // Get assignments for this course
    const courseAssignments = dataService.getAssignmentsByCourse(id);

    // Get user's rating for this course
    const userCourseRating = dataService.getUserCourseRating(id, currentUser.email);
    
    // Get course rating statistics
    const ratingStats = dataService.getCourseRatingStats(id);

    setCourse(courseData);
    setEnrollment(enrollmentData);
    setAssignments(courseAssignments);
    setProgress(enrollmentData.progress);
    setCompletedLessons(enrollmentData.completedLessons);
    setUserRating(userCourseRating);
    setCourseStats(ratingStats);
    setLoading(false);
  };

  const toggleLesson = (moduleIndex, topicIndex) => {
    if (!course || !enrollment) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const totalLessons = course.syllabus.reduce((total, module) => total + module.topics.length, 0);
    
    const newCompletedLessons = completedLessons + 1;
    const newProgress = Math.round((newCompletedLessons / totalLessons) * 100);

    // Update enrollment progress
    dataService.updateEnrollmentProgress(currentUser.email, id, newProgress, newCompletedLessons);
    
    setCompletedLessons(newCompletedLessons);
    setProgress(newProgress);

    // Show completion toast and offer rating
    if (newProgress === 100 && !hasCompletedToastShown) {
      toast.success("🎉 Congratulations! You completed the course!");
      setHasCompletedToastShown(true);
      
      // Encourage rating if not already rated
      if (!userRating) {
        setTimeout(() => {
          toast("💭 How was your experience? Consider rating this course!", {
            duration: 6000,
            icon: "⭐"
          });
        }, 2000);
      }
    }
  };

  const handleRatingUpdate = () => {
    // Reload rating data after user submits a rating
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userCourseRating = dataService.getUserCourseRating(id, currentUser.email);
    const ratingStats = dataService.getCourseRatingStats(id);
    
    setUserRating(userCourseRating);
    setCourseStats(ratingStats);
    
    // Update the course object to reflect new rating
    const updatedCourse = dataService.getCourseById(id);
    setCourse(updatedCourse);
  };

  const getAssignmentStatus = (assignment) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const submission = assignment.submissions.find(s => s.studentId === currentUser.email);
    
    if (!submission) return { status: "not_submitted", grade: null };
    return { status: submission.status, grade: submission.grade };
  };

  const handleAssignmentSubmit = (assignmentId, submissionUrl) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const success = dataService.submitAssignment(assignmentId, currentUser.email, {
      submissionUrl: submissionUrl || prompt("Enter your submission URL (GitHub, portfolio, etc.):")
    });

    if (success) {
      toast.success("Assignment submitted successfully!");
      loadCourseData(); // Reload to show updated status
    } else {
      toast.error("Failed to submit assignment");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-8">
        <div className="text-4xl mb-4">📚</div>
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto text-center py-8">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <p className="text-gray-600">The course you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="max-w-3xl mx-auto text-center py-8">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">Not Enrolled</h2>
        <p className="text-gray-600 mb-4">You need to enroll in this course to access the content.</p>
        <button
          onClick={() => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (dataService.enrollStudent(currentUser.email, id)) {
              toast.success("Enrolled successfully!");
              loadCourseData();
            } else {
              toast.error("Failed to enroll");
            }
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Enroll Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {course.image ? "📚" : "📖"} {course.title}
        </h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
          <span>👨‍🏫 {course.instructorName}</span>
          <span>📚 {course.category}</span>
          <span>📊 {course.level}</span>
          <span>⏱️ {course.duration}</span>
          <div className="flex items-center gap-1">
            <StarRating rating={courseStats.averageRating} size="text-sm" />
            <span>({courseStats.totalReviews} reviews)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}% ({completedLessons}/{course.syllabus.reduce((total, module) => total + module.topics.length, 0)} lessons)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-4">Course Content</h2>
          
          <div className="space-y-4 mb-8">
            {course.syllabus.map((module, moduleIndex) => (
              <div key={moduleIndex} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">{module.module}</h3>
                
                <ul className="space-y-3">
                  {module.topics.map((topic, topicIndex) => {
                    const lessonId = `${moduleIndex}-${topicIndex}`;
                    const isCompleted = (moduleIndex * 3 + topicIndex) < completedLessons;
                    
                    return (
                      <li key={topicIndex} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => !isCompleted && toggleLesson(moduleIndex, topicIndex)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`flex-1 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {topic}
                        </span>
                        {isCompleted && (
                          <span className="text-green-600 text-sm">✓ Completed</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Assignments Section */}
          {assignments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Assignments</h2>
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const assignmentStatus = getAssignmentStatus(assignment);
                  
                  return (
                    <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <p className="text-gray-600">{assignment.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Due: {assignment.dueDate} • {assignment.points} points
                          </p>
                        </div>
                        <div className="text-right">
                          {assignmentStatus.status === "graded" && (
                            <div className="text-lg font-bold text-green-600">
                              {assignmentStatus.grade}%
                            </div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assignmentStatus.status === "graded" ? "bg-green-100 text-green-800" :
                            assignmentStatus.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {assignmentStatus.status === "graded" ? "Graded" :
                             assignmentStatus.status === "pending" ? "Submitted" :
                             "Not Submitted"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-700 mb-4">{assignment.instructions}</p>
                        
                        {assignmentStatus.status === "not_submitted" && (
                          <button
                            onClick={() => handleAssignmentSubmit(assignment.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Submit Assignment
                          </button>
                        )}
                        
                        {assignmentStatus.status === "graded" && (
                          <div className="bg-green-50 border border-green-200 rounded p-4">
                            <p className="text-sm text-green-800">
                              <strong>Feedback:</strong> {
                                assignment.submissions.find(s => s.studentId === JSON.parse(localStorage.getItem("currentUser")).email)?.feedback || "No feedback provided"
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rating Section - Only show if student has made some progress */}
          {progress > 0 && (
            <div className="mb-8">
              <CourseRating
                courseId={id}
                currentUserRating={userRating}
                onRatingUpdate={handleRatingUpdate}
              />
            </div>
          )}

          {/* Reviews Section */}
          <CourseReviews courseId={id} />
        </div>

        {/* Course Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Course Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center gap-1">
                  <StarRating rating={courseStats.averageRating} size="text-xs" />
                  <span className="font-medium">{courseStats.averageRating}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
            <ul className="space-y-2">
              {course.objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          {course.requirements.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lessons Done</span>
                <span className="font-medium">{completedLessons}/{course.syllabus.reduce((total, module) => total + module.topics.length, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Assignments</span>
                <span className="font-medium">
                  {assignments.filter(a => a.submissions.some(s => s.studentId === JSON.parse(localStorage.getItem("currentUser")).email)).length}/{assignments.length}
                </span>
              </div>
              {progress === 100 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-green-600 text-2xl mb-1">🎉</div>
                  <p className="text-sm font-medium text-green-800">Course Completed!</p>
                  <p className="text-xs text-green-600">Certificate available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                📄 Print Course Content
              </button>
              <button
                onClick={() => {
                  const courseUrl = window.location.href;
                  navigator.clipboard.writeText(courseUrl);
                  toast.success("Course link copied!");
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                🔗 Share Course
              </button>
              {progress === 100 && (
                <button
                  onClick={() => window.location.href = '/certificates'}
                  className="w-full text-left px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-md font-medium"
                >
                  🎓 View Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
               