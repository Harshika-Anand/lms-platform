import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "./Layout"; // Student layout
import TeacherLayout from "./TeacherLayout"; // Teacher layout

function RoleBasedLayout() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Return appropriate layout based on user role
  return user.role === "Teacher" ? <TeacherLayout /> : <Layout />;
}

export default RoleBasedLayout;