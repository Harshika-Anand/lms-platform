import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import dataService from "../../services/dataService";

function CreateCourse() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    level: "Beginner",
    duration: "",
    price: "",
    image: "",
    objectives: [""],
    requirements: [""],
    syllabus: [{ module: "", topics: [""] }]
  });

  const categories = [
    "Web Development", "Data Science", "Mobile Development", 
    "Design", "Business", "Marketing", "Programming"
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSyllabusChange = (moduleIndex, field, value, topicIndex = null) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => {
        if (i === moduleIndex) {
          if (field === "module") {
            return { ...module, module: value };
          } else if (field === "topics" && topicIndex !== null) {
            return {
              ...module,
              topics: module.topics.map((topic, j) => j === topicIndex ? value : topic)
            };
          }
        }
        return module;
      })
    }));
  };

  const addSyllabusModule = () => {
    setCourseData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { module: "", topics: [""] }]
    }));
  };

  const addSyllabusTopic = (moduleIndex) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => 
        i === moduleIndex 
          ? { ...module, topics: [...module.topics, ""] }
          : module
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user (instructor)
      const user = JSON.parse(localStorage.getItem("currentUser"));
      
      if (!user || user.role !== "Teacher") {
        toast.error("Only teachers can create courses");
        return;
      }

      // Clean up data - remove empty fields
      const cleanedData = {
        ...courseData,
        objectives: courseData.objectives.filter(obj => obj.trim() !== ""),
        requirements: courseData.requirements.filter(req => req.trim() !== ""),
        syllabus: courseData.syllabus
          .filter(module => module.module.trim() !== "")
          .map(module => ({
            ...module,
            topics: module.topics.filter(topic => topic.trim() !== "")
          }))
          .filter(module => module.topics.length > 0)
      };

      // Validate required fields
      if (!cleanedData.title.trim() || !cleanedData.description.trim()) {
        toast.error("Title and description are required");
        return;
      }

      if (cleanedData.objectives.length === 0) {
        toast.error("At least one learning objective is required");
        return;
      }

      if (cleanedData.syllabus.length === 0) {
        toast.error("At least one syllabus module is required");
        return;
      }

      // Create course using data service
      const newCourse = dataService.createCourse(
        cleanedData,
        user.email, // instructorId
        user.name   // instructorName
      );

      toast.success("Course created successfully!");
      navigate("/teacher/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create your course</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
              <input
                type="text"
                name="title"
                required
                value={courseData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Complete React Development Course"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
              <select
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
              <input
                type="number"
                name="duration"
                value={courseData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Image URL</label>
              <input
                type="url"
                name="image"
                value={courseData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              required
              value={courseData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what students will learn in this course..."
            />
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
          {courseData.objectives.map((objective, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => handleArrayChange("objectives", index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What will students learn?"
              />
              {courseData.objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("objectives", index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("objectives")}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Learning Objective
          </button>
        </div>

        {/* Requirements */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Prerequisites</h2>
          {courseData.requirements.map((requirement, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What should students know before taking this course?"
              />
              {courseData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("requirements", index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("requirements")}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Requirement
          </button>
        </div>

        {/* Course Syllabus */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Course Syllabus</h2>
          {courseData.syllabus.map((module, moduleIndex) => (
            <div key={moduleIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={module.module}
                  onChange={(e) => handleSyllabusChange(moduleIndex, "module", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Module ${moduleIndex + 1} title`}
                />
              </div>
              
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Topics:</p>
                {module.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleSyllabusChange(moduleIndex, "topics", e.target.value, topicIndex)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder={`Topic ${topicIndex + 1}`}
                    />
                    {module.topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCourseData(prev => ({
                            ...prev,
                            syllabus: prev.syllabus.map((mod, i) => 
                              i === moduleIndex 
                                ? { ...mod, topics: mod.topics.filter((_, j) => j !== topicIndex) }
                                : mod
                            )
                          }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSyllabusTopic(moduleIndex)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Topic
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSyllabusModule}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Module
          </button>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/teacher/courses")}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;