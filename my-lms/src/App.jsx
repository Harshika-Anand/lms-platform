import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import TeacherLayout from "./components/TeacherLayout";
import RoleBasedLayout from "./components/RoleBasedLayout";

// Student Components
import Dashboard from "./pages/student/Dashboard";
import Courses from "./pages/student/Courses";
import MyCertificates from "./pages/student/MyCertificates";
import Profile from "./pages/student/Profile";
import CourseDetail from "./pages/student/CourseDetail";
import Enroll from "./pages/student/Enroll";

// Teacher Components
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateCourse from "./pages/teacher/CreateCourse";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import Students from "./pages/teacher/Students";
import Grades from "./pages/teacher/Grades";
import Assignments from "./pages/teacher/Assignments";
import Analytics from "./pages/teacher/Analytics";
import TeacherProfile from "./pages/teacher/TeacherProfile";

// Auth Components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes with Role-Based Layout */}
        <Route
          element={
            <PrivateRoute>
              <RoleBasedLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard Route - Role-based */}
          <Route path="/" element={<RoleBasedDashboard />} />
          
          {/* Student Routes */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/certificates" element={<MyCertificates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/enroll/:courseId" element={<Enroll />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/create-course" element={<CreateCourse />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/students" element={<Students />} />
          <Route path="/teacher/grades" element={<Grades />} />
          <Route path="/teacher/assignments" element={<Assignments />} />
          <Route path="/teacher/analytics" element={<Analytics />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Component to determine which dashboard to show based on user role
function RoleBasedDashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  
  if (!user) return <Navigate to="/login" replace />;
  
  return user.role === "Teacher" ? <TeacherDashboard /> : <Dashboard />;
}

export default App;