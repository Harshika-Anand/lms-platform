import React from "react";
import { Link } from 'react-router-dom';

function ContinueCourseCard({ enrollment, course }) {
  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-gray-400";
    if (progress < 30) return "bg-red-500";
    if (progress < 60) return "bg-yellow-500";
    if (progress < 90) return "bg-blue-500";
    return "bg-green-500";
  };

  const formatLastAccessed = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link
      to={`/course/${course.id}`}
      className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">
            {course.image ? course.image : "📚"}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {enrollment.progress}% completed
                </p>
                <p className="text-xs text-gray-400">
                  {enrollment.completedLessons} of {enrollment.totalLessons} lessons
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Last accessed: {formatLastAccessed(enrollment.lastAccessed)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex flex-col items-end">
          <div className="w-32 bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all ${getProgressColor(enrollment.progress)}`}
              style={{ width: `${enrollment.progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-600">
            {enrollment.progress === 100 ? "Completed!" : "Continue →"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ContinueCourseCard;