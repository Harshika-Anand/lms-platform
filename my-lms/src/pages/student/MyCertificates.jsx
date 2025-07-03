import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dataService from "../../services/dataService";

function MyCertificates() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "Student") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    // Get student's enrollments
    const enrollments = dataService.getEnrollmentsByStudent(currentUser.email);
    
    // Get completed courses (100% progress)
    const completedEnrollments = enrollments.filter(enrollment => enrollment.progress === 100);
    
    // Get course details and create certificates
    const completedCertificates = completedEnrollments.map(enrollment => {
      const course = dataService.getCourseById(enrollment.courseId);
      const assignments = dataService.getAssignmentsByCourse(enrollment.courseId);
      
      // Calculate average grade from assignments
      const studentSubmissions = assignments.flatMap(assignment => 
        assignment.submissions.filter(submission => 
          submission.studentId === currentUser.email && 
          submission.status === "graded" && 
          submission.grade !== null
        )
      );
      
      const averageGrade = studentSubmissions.length > 0 
        ? Math.round(studentSubmissions.reduce((sum, sub) => sum + sub.grade, 0) / studentSubmissions.length)
        : 0;

      return {
        id: `cert_${enrollment.id}`,
        courseId: course.id,
        courseName: course.title,
        courseDescription: course.description,
        courseImage: course.image,
        courseLevel: course.level,
        courseDuration: course.duration,
        instructorName: course.instructorName,
        studentName: currentUser.name,
        completedDate: enrollment.lastAccessed, // In a real app, this would be completion date
        enrolledDate: enrollment.enrolledAt,
        totalLessons: enrollment.totalLessons,
        averageGrade: averageGrade,
        certificateId: `CERT-${course.id}-${currentUser.email.split('@')[0].toUpperCase()}-${Date.now()}`,
        syllabus: course.syllabus || []
      };
    });

    setCertificates(completedCertificates);
    setLoading(false);
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleDownloadCertificate = (certificate) => {
    // In a real app, this would generate and download a PDF
    // For now, we'll show an alert with certificate details
    alert(`Certificate downloaded!\n\nCourse: ${certificate.courseName}\nStudent: ${certificate.studentName}\nCompleted: ${certificate.completedDate}\nGrade: ${certificate.averageGrade}%`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLetter = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📜</div>
        <p>Loading certificates...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
        <p className="text-gray-600">
          {certificates.length > 0 
            ? `Congratulations! You've earned ${certificates.length} certificate${certificates.length === 1 ? '' : 's'}.`
            : "Complete courses to earn certificates and showcase your achievements."
          }
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No certificates yet</h2>
          <p className="text-gray-600 mb-6">
            Complete your enrolled courses to earn certificates and showcase your achievements.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">{certificates.length}</div>
              <div className="text-sm text-gray-600">Certificates Earned</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(certificates.reduce((sum, cert) => sum + cert.averageGrade, 0) / certificates.length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Average Grade</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">
                {certificates.reduce((sum, cert) => sum + cert.totalLessons, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Lessons Completed</div>
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                {/* Certificate Header */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎓</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Certificate of Completion
                  </h3>
                  <p className="text-xs text-gray-500">ID: {certificate.certificateId}</p>
                </div>

                {/* Course Info */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{certificate.courseName}</h4>
                  <p className="text-sm text-gray-600 mb-2">{certificate.courseDescription}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Instructor:</span> {certificate.instructorName}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span> {certificate.courseLevel}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {certificate.courseDuration}
                    </div>
                    <div>
                      <span className="font-medium">Lessons:</span> {certificate.totalLessons}
                    </div>
                  </div>
                </div>

                {/* Grade & Date */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Final Grade</p>
                      <p className={`text-xl font-bold ${getGradeColor(certificate.averageGrade)}`}>
                        {certificate.averageGrade}% ({getGradeLetter(certificate.averageGrade)})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(certificate.completedDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewCertificate(certificate)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium transition"
                  >
                    View Certificate
                  </button>
                  <button
                    onClick={() => handleDownloadCertificate(certificate)}
                    className="bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 text-sm"
                    title="Download Certificate"
                  >
                    📥
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Certificate Design */}
            <div className="p-8 border-4 border-blue-600 m-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">🎓</div>
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Certificate of Completion</h1>
                <p className="text-blue-600">This certifies that</p>
              </div>

              {/* Student Name */}
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
                  {selectedCertificate.studentName}
                </h2>
              </div>

              {/* Course Details */}
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-2">has successfully completed the course</p>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  {selectedCertificate.courseName}
                </h3>
                <p className="text-gray-600 mb-4">{selectedCertificate.courseDescription}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Instructor:</span> {selectedCertificate.instructorName}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {selectedCertificate.courseDuration}
                  </div>
                  <div>
                    <span className="font-medium">Level:</span> {selectedCertificate.courseLevel}
                  </div>
                  <div>
                    <span className="font-medium">Total Lessons:</span> {selectedCertificate.totalLessons}
                  </div>
                </div>

                {/* Grade */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Final Grade</p>
                  <p className={`text-2xl font-bold ${getGradeColor(selectedCertificate.averageGrade)}`}>
                    {selectedCertificate.averageGrade}% ({getGradeLetter(selectedCertificate.averageGrade)})
                  </p>
                </div>
              </div>

              {/* Course Syllabus */}
              {selectedCertificate.syllabus.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Course Curriculum</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCertificate.syllabus.map((module, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-900 text-sm">{module.module}</h5>
                        <p className="text-xs text-gray-600">{module.topics.length} topics</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
                <div>
                  <p><strong>Certificate ID:</strong> {selectedCertificate.certificateId}</p>
                  <p><strong>Enrolled:</strong> {formatDate(selectedCertificate.enrolledDate)}</p>
                </div>
                <div className="text-right">
                  <p><strong>Completed:</strong> {formatDate(selectedCertificate.completedDate)}</p>
                  <p><strong>Issued:</strong> {formatDate(new Date().toISOString())}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => handleDownloadCertificate(selectedCertificate)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
              >
                Download Certificate
              </button>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCertificates;