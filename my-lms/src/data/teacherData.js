// src/data/teacherData.js

export const dummyCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      description: "Learn HTML, CSS, and JavaScript fundamentals",
      students: 45,
      progress: 75,
      status: "active",
      lastUpdated: "2 days ago",
      nextDeadline: "Assignment due in 3 days",
      pendingGrades: 12,
    },
    {
      id: 2,
      title: "Advanced React Concepts",
      description: "Deep dive into React hooks, context, and performance",
      students: 28,
      progress: 60,
      status: "active",
      lastUpdated: "1 day ago",
      nextDeadline: "Quiz due tomorrow",
      pendingGrades: 8,
    },
    {
      id: 3,
      title: "Database Design Principles",
      description: "Master SQL and database architecture",
      students: 32,
      progress: 40,
      status: "draft",
      lastUpdated: "5 days ago",
      nextDeadline: "Module 3 release",
      pendingGrades: 0,
    },
  ];
  
  export const recentActivity = [
    { action: "New student enrolled", course: "Web Development", time: "2 hours ago" },
    { action: "Assignment submitted", course: "React Concepts", time: "4 hours ago" },
    { action: "Quiz completed", course: "Web Development", time: "6 hours ago" },
    { action: "Course updated", course: "Database Design", time: "1 day ago" },
    { action: "New discussion post", course: "React Concepts", time: "1 day ago" },
  ];
  