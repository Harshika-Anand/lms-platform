import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import dataService from "../services/dataService";

// Rating Component for displaying stars
function StarRating({ rating, size = "text-lg", interactive = false, onRate = null }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${size} ${
            interactive ? "cursor-pointer hover:scale-110 transition" : "cursor-default"
          } ${
            star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHoveredRating(star)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}

// Main Course Rating Component
function CourseRating({ courseId, currentUserRating = null, onRatingUpdate = null }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(currentUserRating?.rating || 0);
  const [userReview, setUserReview] = useState(currentUserRating?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (!userRating) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const success = dataService.addCourseRating(courseId, user.email, {
        rating: userRating,
        comment: userReview.trim(),
        studentName: user.name
      });

      if (success) {
        toast.success("Thank you for your rating!");
        setShowReviewForm(false);
        onRatingUpdate && onRatingUpdate();
      } else {
        toast.error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Rating submission error:", error);
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRating = () => {
    setShowReviewForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate This Course</h3>
      
      {currentUserRating ? (
        // Show existing rating
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <StarRating rating={currentUserRating.rating} />
              <span className="text-sm text-gray-600">Your rating</span>
            </div>
            <button
              onClick={handleEditRating}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
          </div>
          {currentUserRating.comment && (
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              "{currentUserRating.comment}"
            </p>
          )}
        </div>
      ) : (
        // Show rating prompt
        <div className="text-center py-4">
          <p className="text-gray-600 mb-3">Share your experience with other students</p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Rate This Course
          </button>
        </div>
      )}

      {/* Rating Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rate This Course</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center space-x-2">
                  <StarRating 
                    rating={userRating} 
                    size="text-2xl"
                    interactive={true}
                    onRate={setUserRating}
                  />
                  <span className="text-sm text-gray-600">
                    ({userRating > 0 ? userRating : 0}/5)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts about this course..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {userReview.length}/500 characters
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRatingSubmit}
                disabled={isSubmitting || !userRating}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Rating"}
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setUserRating(currentUserRating?.rating || 0);
                  setUserReview(currentUserRating?.comment || "");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Course Reviews Display Component
function CourseReviews({ courseId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  const loadReviews = () => {
    try {
      const courseReviews = dataService.getCourseReviews(courseId);
      setReviews(courseReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center py-8">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Student Reviews ({reviews.length})
        </h3>
        {reviews.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">💭</div>
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {review.studentName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.studentName}</p>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={review.rating} size="text-sm" />
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 text-sm ml-11">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { StarRating, CourseRating, CourseReviews };