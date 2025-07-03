// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "Student",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value.trimStart() }));

  const handleSignup = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(
      (u) => u.email === form.email || u.username === form.username
    );

    if (exists) {
      toast.error("User with email or username already exists");
      return;
    }

    const newUser = {
      ...form,
      joined: new Date().toLocaleDateString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    toast.success("Account created");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">Sign Up</h1>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          >
            <option>Student</option>
            <option>Teacher</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
