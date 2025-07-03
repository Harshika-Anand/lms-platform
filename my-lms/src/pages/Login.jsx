// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple submissions
    if (isLoading) {
      console.log("Already processing login, ignoring...");
      return;
    }
    
    console.log("Login attempt with:", form); // Debug log
    
    setIsLoading(true);
    
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("Users in storage:", users); // Debug log
      
      // Find matching user
      const user = users.find(
        (u) =>
          (u.email === form.identifier || u.username === form.identifier) &&
          u.password === form.password
      );
      
      console.log("Found user:", user); // Debug log
      
      if (!user) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }
      
      // Store current user
      localStorage.setItem("currentUser", JSON.stringify(user));
      console.log("Stored current user:", JSON.parse(localStorage.getItem("currentUser"))); // Debug log
      toast.success("Logged in successfully");
      
      // Navigate immediately - no need for timeout
      console.log("Navigating to dashboard..."); // Debug log
      navigate("/", { replace: true });
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6"
        noValidate
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">Login</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email or Username
          </label>
          <input
            type="text"
            name="identifier"
            required
            value={form.identifier}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        {/* Temporary debug button - remove after testing 
        <button
          type="button"
          onClick={() => {
            console.log("Current localStorage state:");
            console.log("users:", localStorage.getItem("users"));
            console.log("currentUser:", localStorage.getItem("currentUser"));
          }}
          className="w-full bg-gray-500 text-white py-1 rounded text-sm"
        >
          Debug LocalStorage
        </button>
        */}

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-800">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;