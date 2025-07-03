// src/services/dataService.js
// This service manages all data and keeps everything connected

class DataService {
    constructor() {
      this.initializeData();
    }
  
    initializeData() {
      // Initialize with sample data if localStorage is empty
      if (!localStorage.getItem('courses')) {
        this.seedInitialData();
      }
    }
  
    seedInitialData() {
      // Sample courses created by teachers
      const courses = [
        {
          id: 1,
          title: "Introduction to Web Development",
          description: "Learn HTML, CSS, and JavaScript fundamentals",
          category: "Web Development",
          level: "Beginner",
          duration: "40 hours",
          price: 99,
          image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
          instructorId: "teacher1@email.com",
          instructorName: "John Smith",
          createdAt: "2024-01-15",
          status: "published",
          objectives: [
            "Build responsive websites with HTML and CSS",
            "Create interactive web pages with JavaScript",
            "Understand web development best practices"
          ],
          requirements: [
            "Basic computer literacy",
            "No prior programming experience needed"
          ],
          syllabus: [
            {
              module: "HTML Fundamentals",
              topics: ["HTML Structure", "Tags and Elements", "Forms and Tables"]
            },
            {
              module: "CSS Styling",
              topics: ["Selectors", "Layout", "Responsive Design"]
            },
            {
              module: "JavaScript Basics",
              topics: ["Variables", "Functions", "DOM Manipulation"]
            }
          ],
          enrolledStudents: ["student1@email.com", "student2@email.com"],
          rating: 4.6,
          reviews: []
        },
        {
          id: 2,
          title: "Advanced React Concepts",
          description: "Deep dive into React hooks, context, and performance",
          category: "Web Development",
          level: "Advanced",
          duration: "30 hours",
          price: 149,
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
          instructorId: "teacher1@email.com",
          instructorName: "John Smith",
          createdAt: "2024-02-01",
          status: "published",
          objectives: [
            "Master React hooks and context",
            "Optimize React application performance",
            "Build scalable React applications"
          ],
          requirements: [
            "Basic React knowledge",
            "JavaScript ES6+ familiarity"
          ],
          syllabus: [
            {
              module: "Advanced Hooks",
              topics: ["useEffect", "useContext", "Custom Hooks"]
            },
            {
              module: "Performance Optimization",
              topics: ["Memoization", "Code Splitting", "Bundle Analysis"]
            }
          ],
          enrolledStudents: ["student1@email.com"],
          rating: 4.8,
          reviews: []
        }
      ];
  
      // Sample assignments linked to courses
      const assignments = [
        {
          id: 1,
          title: "HTML/CSS Portfolio Project",
          description: "Create a personal portfolio website using HTML and CSS",
          courseId: 1,
          courseName: "Introduction to Web Development",
          instructorId: "teacher1@email.com",
          type: "project",
          dueDate: "2024-07-15",
          points: 100,
          status: "published",
          instructions: "Build a responsive portfolio website that showcases your skills. Include at least 3 pages: Home, About, and Projects. Use modern CSS techniques like Flexbox or Grid for layout.",
          createdAt: "2024-06-15",
          submissions: [
            {
              studentId: "student1@email.com",
              studentName: "Alice Johnson",
              submittedAt: "2024-07-09",
              status: "graded",
              grade: 92,
              feedback: "Excellent work! Clean code and great design. Consider adding more interactive elements.",
              submissionUrl: "https://github.com/alice/portfolio"
            },
            {
              studentId: "student2@email.com", 
              studentName: "Bob Smith",
              submittedAt: "2024-07-10",
              status: "pending",
              grade: null,
              feedback: "",
              submissionUrl: "https://github.com/bob/portfolio"
            }
          ]
        },
        {
          id: 2,
          title: "React Components Quiz",
          description: "Test your understanding of React components and props",
          courseId: 2,
          courseName: "Advanced React Concepts",
          instructorId: "teacher1@email.com",
          type: "quiz",
          dueDate: "2024-07-10",
          points: 50,
          status: "published",
          instructions: "Complete all questions about React components, props, and state management.",
          createdAt: "2024-06-20",
          submissions: [
            {
              studentId: "student1@email.com",
              studentName: "Alice Johnson",
              submittedAt: "2024-07-05",
              status: "graded",
              grade: 95,
              feedback: "Perfect understanding of React concepts!",
              submissionUrl: null
            }
          ]
        }
      ];
  
      // Sample enrollments
      const enrollments = [
        {
          id: 1,
          studentId: "student1@email.com",
          studentName: "Alice Johnson",
          courseId: 1,
          courseName: "Introduction to Web Development",
          instructorId: "teacher1@email.com",
          enrolledAt: "2024-01-20",
          progress: 75,
          status: "active",
          completedLessons: 15,
          totalLessons: 20,
          lastAccessed: "2024-07-01"
        },
        {
          id: 2,
          studentId: "student1@email.com",
          studentName: "Alice Johnson",
          courseId: 2,
          courseName: "Advanced React Concepts",
          instructorId: "teacher1@email.com",
          enrolledAt: "2024-02-15",
          progress: 60,
          status: "active",
          completedLessons: 9,
          totalLessons: 15,
          lastAccessed: "2024-06-28"
        },
        {
          id: 3,
          studentId: "student2@email.com",
          studentName: "Bob Smith",
          courseId: 1,
          courseName: "Introduction to Web Development",
          instructorId: "teacher1@email.com",
          enrolledAt: "2024-02-10",
          progress: 45,
          status: "active",
          completedLessons: 9,
          totalLessons: 20,
          lastAccessed: "2024-06-25"
        }
      ];
  
      // Sample users (students and teachers)
      const users = [
        {
          id: "teacher1@email.com",
          name: "John Smith",
          email: "teacher1@email.com",
          username: "johnsmith",
          role: "Teacher",
          joined: "2023-12-01",
          bio: "Experienced web developer with 8+ years in the industry",
          expertise: ["JavaScript", "React", "Node.js", "Web Development"],
          education: "M.S. Computer Science, Stanford University",
          profileImage: ""
        },
        {
          id: "student1@email.com",
          name: "Alice Johnson",
          email: "student1@email.com",
          username: "alicejohnson",
          role: "Student",
          joined: "2024-01-15",
          bio: "Aspiring web developer",
          profileImage: ""
        },
        {
          id: "student2@email.com",
          name: "Bob Smith",
          email: "student2@email.com",
          username: "bobsmith",
          role: "Student", 
          joined: "2024-02-10",
          bio: "Career changer looking to learn web development",
          profileImage: ""
        }
      ];
  
      // Save to localStorage
      localStorage.setItem('courses', JSON.stringify(courses));
      localStorage.setItem('assignments', JSON.stringify(assignments));
      localStorage.setItem('enrollments', JSON.stringify(enrollments));
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    // COURSE METHODS
    getAllCourses() {
      return JSON.parse(localStorage.getItem('courses') || '[]');
    }
  
    getCoursesByInstructor(instructorId) {
      const courses = this.getAllCourses();
      return courses.filter(course => course.instructorId === instructorId);
    }
  
    getCourseById(courseId) {
      const courses = this.getAllCourses();
      return courses.find(course => course.id == courseId);
    }
  
    createCourse(courseData, instructorId, instructorName) {
      const courses = this.getAllCourses();
      const newCourse = {
        id: Date.now(),
        ...courseData,
        instructorId,
        instructorName,
        createdAt: new Date().toISOString().split('T')[0],
        status: "draft",
        enrolledStudents: [],
        rating: 0,
        reviews: []
      };
      
      courses.push(newCourse);
      localStorage.setItem('courses', JSON.stringify(courses));
      return newCourse;
    }
  
    updateCourse(courseId, updates) {
      const courses = this.getAllCourses();
      const index = courses.findIndex(course => course.id == courseId);
      if (index !== -1) {
        courses[index] = { ...courses[index], ...updates };
        localStorage.setItem('courses', JSON.stringify(courses));
        return courses[index];
      }
      return null;
    }
  
    deleteCourse(courseId) {
      const courses = this.getAllCourses();
      const filtered = courses.filter(course => course.id != courseId);
      localStorage.setItem('courses', JSON.stringify(filtered));
      
      // Also clean up related data
      this.deleteEnrollmentsByCourse(courseId);
      this.deleteAssignmentsByCourse(courseId);
    }
  
    // ENROLLMENT METHODS
    getAllEnrollments() {
      return JSON.parse(localStorage.getItem('enrollments') || '[]');
    }
  
    getEnrollmentsByStudent(studentId) {
      const enrollments = this.getAllEnrollments();
      return enrollments.filter(enrollment => enrollment.studentId === studentId);
    }
  
    getEnrollmentsByInstructor(instructorId) {
      const enrollments = this.getAllEnrollments();
      return enrollments.filter(enrollment => enrollment.instructorId === instructorId);
    }
  
    getEnrollmentsByCourse(courseId) {
      const enrollments = this.getAllEnrollments();
      return enrollments.filter(enrollment => enrollment.courseId == courseId);
    }
  
    enrollStudent(studentId, courseId) {
      const course = this.getCourseById(courseId);
      const student = this.getUserById(studentId);
      
      if (!course || !student) return false;
  
      // Check if already enrolled
      const enrollments = this.getAllEnrollments();
      const existing = enrollments.find(e => e.studentId === studentId && e.courseId == courseId);
      if (existing) return false;
  
      // Create enrollment
      const enrollment = {
        id: Date.now(),
        studentId,
        studentName: student.name,
        courseId: parseInt(courseId),
        courseName: course.title,
        instructorId: course.instructorId,
        enrolledAt: new Date().toISOString().split('T')[0],
        progress: 0,
        status: "active",
        completedLessons: 0,
        totalLessons: course.syllabus?.reduce((total, module) => total + module.topics.length, 0) || 10,
        lastAccessed: new Date().toISOString().split('T')[0]
      };
  
      enrollments.push(enrollment);
      localStorage.setItem('enrollments', JSON.stringify(enrollments));
  
      // Update course enrollment list
      course.enrolledStudents.push(studentId);
      this.updateCourse(courseId, { enrolledStudents: course.enrolledStudents });
  
      return true;
    }
  
    deleteEnrollmentsByCourse(courseId) {
      const enrollments = this.getAllEnrollments();
      const filtered = enrollments.filter(enrollment => enrollment.courseId != courseId);
      localStorage.setItem('enrollments', JSON.stringify(filtered));
    }
  
    updateEnrollmentProgress(studentId, courseId, progress, completedLessons) {
      const enrollments = this.getAllEnrollments();
      const index = enrollments.findIndex(e => e.studentId === studentId && e.courseId == courseId);
      
      if (index !== -1) {
        enrollments[index].progress = progress;
        enrollments[index].completedLessons = completedLessons;
        enrollments[index].lastAccessed = new Date().toISOString().split('T')[0];
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        return enrollments[index];
      }
      return null;
    }
  
    // ASSIGNMENT METHODS
    getAllAssignments() {
      return JSON.parse(localStorage.getItem('assignments') || '[]');
    }
  
    getAssignmentsByInstructor(instructorId) {
      const assignments = this.getAllAssignments();
      return assignments.filter(assignment => assignment.instructorId === instructorId);
    }
  
    getAssignmentsByCourse(courseId) {
      const assignments = this.getAllAssignments();
      return assignments.filter(assignment => assignment.courseId == courseId);
    }
  
    getAssignmentsByStudent(studentId) {
      // Get assignments for courses the student is enrolled in
      const enrollments = this.getEnrollmentsByStudent(studentId);
      const courseIds = enrollments.map(e => e.courseId);
      const assignments = this.getAllAssignments();
      
      return assignments.filter(assignment => 
        courseIds.includes(assignment.courseId) && assignment.status === 'published'
      );
    }
  
    createAssignment(assignmentData, instructorId) {
      const assignments = this.getAllAssignments();
      const course = this.getCourseById(assignmentData.courseId);
      
      const newAssignment = {
        id: Date.now(),
        ...assignmentData,
        courseId: parseInt(assignmentData.courseId),
        courseName: course.title,
        instructorId,
        createdAt: new Date().toISOString().split('T')[0],
        submissions: []
      };
  
      assignments.push(newAssignment);
      localStorage.setItem('assignments', JSON.stringify(assignments));
      return newAssignment;
    }
  
    deleteAssignmentsByCourse(courseId) {
      const assignments = this.getAllAssignments();
      const filtered = assignments.filter(assignment => assignment.courseId != courseId);
      localStorage.setItem('assignments', JSON.stringify(filtered));
    }
  
    submitAssignment(assignmentId, studentId, submissionData) {
      const assignments = this.getAllAssignments();
      const student = this.getUserById(studentId);
      const assignmentIndex = assignments.findIndex(a => a.id == assignmentId);
      
      if (assignmentIndex === -1 || !student) return false;
  
      const submission = {
        studentId,
        studentName: student.name,
        submittedAt: new Date().toISOString().split('T')[0],
        status: "pending",
        grade: null,
        feedback: "",
        ...submissionData
      };
  
      // Check if student already submitted
      const existingIndex = assignments[assignmentIndex].submissions.findIndex(
        s => s.studentId === studentId
      );
  
      if (existingIndex !== -1) {
        // Update existing submission
        assignments[assignmentIndex].submissions[existingIndex] = submission;
      } else {
        // Add new submission
        assignments[assignmentIndex].submissions.push(submission);
      }
  
      localStorage.setItem('assignments', JSON.stringify(assignments));
      return true;
    }
  
    gradeSubmission(assignmentId, studentId, grade, feedback) {
      const assignments = this.getAllAssignments();
      const assignmentIndex = assignments.findIndex(a => a.id == assignmentId);
      
      if (assignmentIndex === -1) return false;
  
      const submissionIndex = assignments[assignmentIndex].submissions.findIndex(
        s => s.studentId === studentId
      );
  
      if (submissionIndex !== -1) {
        assignments[assignmentIndex].submissions[submissionIndex].grade = grade;
        assignments[assignmentIndex].submissions[submissionIndex].feedback = feedback;
        assignments[assignmentIndex].submissions[submissionIndex].status = "graded";
        
        localStorage.setItem('assignments', JSON.stringify(assignments));
        return true;
      }
      return false;
    }

    // Add these methods to your existing dataService.js

// RATING AND REVIEW METHODS
addCourseRating(courseId, studentId, ratingData) {
    try {
      const courses = this.getAllCourses();
      const courseIndex = courses.findIndex(course => course.id == courseId);
      
      if (courseIndex === -1) return false;
  
      // Initialize reviews array if it doesn't exist
      if (!courses[courseIndex].reviews) {
        courses[courseIndex].reviews = [];
      }
  
      // Check if user already rated this course
      const existingReviewIndex = courses[courseIndex].reviews.findIndex(
        review => review.studentId === studentId
      );
  
      const newReview = {
        studentId,
        studentName: ratingData.studentName,
        rating: ratingData.rating,
        comment: ratingData.comment || "",
        createdAt: new Date().toISOString()
      };
  
      if (existingReviewIndex !== -1) {
        // Update existing review
        courses[courseIndex].reviews[existingReviewIndex] = newReview;
      } else {
        // Add new review
        courses[courseIndex].reviews.push(newReview);
      }
  
      // Recalculate average rating
      const reviews = courses[courseIndex].reviews;
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      courses[courseIndex].rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
  
      localStorage.setItem('courses', JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error("Error adding course rating:", error);
      return false;
    }
  }
  
  getCourseReviews(courseId) {
    try {
      const course = this.getCourseById(courseId);
      return course?.reviews || [];
    } catch (error) {
      console.error("Error getting course reviews:", error);
      return [];
    }
  }
  
  getUserCourseRating(courseId, studentId) {
    try {
      const reviews = this.getCourseReviews(courseId);
      return reviews.find(review => review.studentId === studentId) || null;
    } catch (error) {
      console.error("Error getting user course rating:", error);
      return null;
    }
  }
  
  getCourseRatingStats(courseId) {
    try {
      const reviews = this.getCourseReviews(courseId);
      
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
      }
  
      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.rating]++;
      });
  
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
        ratingDistribution
      };
    } catch (error) {
      console.error("Error getting course rating stats:", error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  }
  
    // USER METHODS
    getAllUsers() {
      return JSON.parse(localStorage.getItem('users') || '[]');
    }
  
    getUserById(userId) {
      const users = this.getAllUsers();
      return users.find(user => user.id === userId || user.email === userId);
    }
  
    getStudentsByInstructor(instructorId) {
      const enrollments = this.getEnrollmentsByInstructor(instructorId);
      const studentIds = [...new Set(enrollments.map(e => e.studentId))];
      
      return studentIds.map(studentId => {
        const user = this.getUserById(studentId);
        const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
        const avgProgress = studentEnrollments.reduce((sum, e) => sum + e.progress, 0) / studentEnrollments.length;
        
        return {
          ...user,
          enrolledCourses: studentEnrollments.length,
          averageProgress: Math.round(avgProgress),
          lastActivity: studentEnrollments.reduce((latest, e) => 
            e.lastAccessed > latest ? e.lastAccessed : latest, ""
          )
        };
      }).filter(Boolean);
    }
  
    updateUser(userId, updates) {
      const users = this.getAllUsers();
      const index = users.findIndex(user => user.id === userId || user.email === userId);
      
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update currentUser if it's the same user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.email === users[index].email) {
          localStorage.setItem('currentUser', JSON.stringify(users[index]));
        }
        
        return users[index];
      }
      return null;
    }
  
    // ANALYTICS METHODS
    getInstructorAnalytics(instructorId) {
      const courses = this.getCoursesByInstructor(instructorId);
      const enrollments = this.getEnrollmentsByInstructor(instructorId);
      const assignments = this.getAssignmentsByInstructor(instructorId);
      
      const totalStudents = new Set(enrollments.map(e => e.studentId)).size;
      const activeStudents = enrollments.filter(e => e.status === 'active').length;
      const avgCompletionRate = enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length || 0;
      
      const gradedSubmissions = assignments.flatMap(a => a.submissions.filter(s => s.grade !== null));
      const avgGrade = gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length || 0;
      
      const pendingGrades = assignments.reduce((sum, a) => 
        sum + a.submissions.filter(s => s.status === 'pending').length, 0
      );
  
      return {
        totalStudents,
        activeStudents,
        totalCourses: courses.length,
        activeCourses: courses.filter(c => c.status === 'published').length,
        avgCompletionRate: Math.round(avgCompletionRate),
        avgGrade: Math.round(avgGrade),
        pendingGrades,
        totalRevenue: courses.reduce((sum, c) => sum + (c.price * c.enrolledStudents.length), 0)
      };
    }
  
    getStudentAnalytics(studentId) {
      const enrollments = this.getEnrollmentsByStudent(studentId);
      const assignments = this.getAssignmentsByStudent(studentId);
      
      const submissions = assignments.flatMap(a => 
        a.submissions.filter(s => s.studentId === studentId)
      );
      
      const gradedSubmissions = submissions.filter(s => s.grade !== null);
      const avgGrade = gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length || 0;
      
      return {
        totalCourses: enrollments.length,
        activeCourses: enrollments.filter(e => e.status === 'active').length,
        completedCourses: enrollments.filter(e => e.progress === 100).length,
        avgProgress: Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length || 0),
        totalAssignments: assignments.length,
        submittedAssignments: submissions.length,
        avgGrade: Math.round(avgGrade),
        pendingSubmissions: assignments.length - submissions.length
      };
    }
  }
  
  // Create singleton instance
  const dataService = new DataService();
  export default dataService;