import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dataService from "../services/dataService";

function SearchAndFilter({ onFilterChange, currentFilters = {} }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || "all");
  const [selectedLevel, setSelectedLevel] = useState(currentFilters.level || "all");
  const [selectedRating, setSelectedRating] = useState(currentFilters.rating || 0);
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "newest");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = [
    "Web Development", "Data Science", "Mobile Development", 
    "Design", "Business", "Marketing", "Programming", "AI/ML"
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
    { value: "title", label: "Alphabetical" },
    { value: "duration", label: "By Duration" }
  ];

  // Generate search suggestions based on available courses
  useEffect(() => {
    if (searchTerm.length > 0) {
      const courses = dataService.getAllCourses();
      const suggestions = [];

      // Add course titles that match
      courses.forEach(course => {
        if (course.title.toLowerCase().includes(searchTerm.toLowerCase()) && !suggestions.includes(course.title)) {
          suggestions.push(course.title);
        }
      });

      // Add instructor names that match
      courses.forEach(course => {
        if (course.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) && !suggestions.includes(course.instructorName)) {
          suggestions.push(course.instructorName);
        }
      });

      // Add categories that match
      categories.forEach(category => {
        if (category.toLowerCase().includes(searchTerm.toLowerCase()) && !suggestions.includes(category)) {
          suggestions.push(category);
        }
      });

      setSearchSuggestions(suggestions.slice(0, 5));
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      level: selectedLevel,
      rating: selectedRating,
      sortBy
    };
    
    onFilterChange && onFilterChange(filters);
  }, [searchTerm, selectedCategory, selectedLevel, selectedRating, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    // Save to recent searches
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      recentSearches.unshift(searchTerm);
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches.slice(0, 5)));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedRating(0);
    setSortBy("newest");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== "all") count++;
    if (selectedLevel !== "all") count++;
    if (selectedRating > 0) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search courses, instructors, or topics..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-600 mr-2">🔍</span>
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition ${
            showAdvanced ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Advanced {showAdvanced ? "▲" : "▼"}
        </button>

        {getActiveFilterCount() > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition"
          >
            Clear Filters ({getActiveFilterCount()})
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                    className={`text-xl ${
                      rating <= selectedRating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400 transition`}
                  >
                    ⭐
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {selectedRating > 0 ? `${selectedRating}+ stars` : "Any rating"}
                </span>
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Duration
              </label>
              <select
                value={currentFilters.duration || "all"}
                onChange={(e) => onFilterChange && onFilterChange({
                  ...currentFilters,
                  duration: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any Duration</option>
                <option value="short">Short (&lt; 20 hours)</option>
                <option value="medium">Medium (20-50 hours)</option>
                <option value="long">Long (50+ hours)</option>
              </select>
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recent Searches
            </label>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(localStorage.getItem("recentSearches") || "[]").map((search, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSearchTerm(search)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchAndFilter;