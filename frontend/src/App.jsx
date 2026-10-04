import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute, PublicRoute } from './routes/Guards';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentSkills from './pages/student/StudentSkills';
import SkillGapPage from './pages/student/SkillGapPage';
import StudentTrainingList from './pages/student/StudentTrainingList';
import StudentTrainingDetails from './pages/student/StudentTrainingDetails';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentJobList from './pages/student/StudentJobList';
import StudentJobDetails from './pages/student/StudentJobDetails';
import StudentApplications from './pages/student/StudentApplications';
import StudentEmployment from './pages/student/StudentEmployment';
import NotificationsPage from './pages/student/NotificationsPage';

// Training Centre Pages
import TrainingDashboard from './pages/training/TrainingDashboard';
import TrainingCourses from './pages/training/TrainingCourses';
import CreateCourse from './pages/training/CreateCourse';
import CourseDetails from './pages/training/CourseDetails';
import EnrolledStudents from './pages/training/EnrolledStudents';
import RecordAssessment from './pages/training/RecordAssessment';
import IssueCertificate from './pages/training/IssueCertificate';
import TrainingPlacements from './pages/training/TrainingPlacements';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerJobList from './pages/employer/EmployerJobList';
import CreateJob from './pages/employer/CreateJob';
import CandidateSearch from './pages/employer/CandidateSearch';
import JobApplications from './pages/employer/JobApplications';
import JobDetails from './pages/employer/JobDetails';
import EmployerHires from './pages/employer/EmployerHires';
import EmploymentVerification from './pages/employer/EmploymentVerification';

// Government Pages
import GovernmentDashboard from './pages/government/GovernmentDashboard';
import DistrictAnalytics from './pages/government/DistrictAnalytics';
import SkillAnalytics from './pages/government/SkillAnalytics';
import TrainingEffectiveness from './pages/government/TrainingEffectiveness';
import EmploymentReports from './pages/government/EmploymentReports';
import Reports from './pages/government/Reports';
import MetricDetails from './pages/government/MetricDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: 'var(--radius)',
              background: 'var(--gray-900)',
              color: '#fff',
              fontSize: '0.875rem',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Student Routes */}
          <Route path="/student" element={
            <RoleRoute roles={['student']}><DashboardLayout /></RoleRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="skills" element={<StudentSkills />} />
            <Route path="skill-gap" element={<SkillGapPage />} />
            <Route path="trainings" element={<StudentTrainingList />} />
            <Route path="training/:id" element={<StudentTrainingDetails />} />
            <Route path="certificates" element={<StudentCertificates />} />
            <Route path="jobs" element={<StudentJobList />} />
            <Route path="jobs/:id" element={<StudentJobDetails />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="employment" element={<StudentEmployment />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Training Centre Routes */}
          <Route path="/training" element={
            <RoleRoute roles={['training_centre']}><DashboardLayout /></RoleRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TrainingDashboard />} />
            <Route path="courses" element={<TrainingCourses />} />
            <Route path="courses/create" element={<CreateCourse />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="students" element={<EnrolledStudents />} />
            <Route path="assessments" element={<RecordAssessment />} />
            <Route path="certificates" element={<IssueCertificate />} />
            <Route path="placements" element={<TrainingPlacements />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Employer Routes */}
          <Route path="/employer" element={
            <RoleRoute roles={['employer']}><DashboardLayout /></RoleRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="profile" element={<EmployerProfile />} />
            <Route path="jobs" element={<EmployerJobList />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="candidates" element={<CandidateSearch />} />
            <Route path="applications" element={<JobApplications />} />
            <Route path="hires" element={<EmployerHires />} />
            <Route path="employment-verification" element={<EmploymentVerification />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Government Routes */}
          <Route path="/government" element={
            <RoleRoute roles={['government']}><DashboardLayout /></RoleRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<GovernmentDashboard />} />
            <Route path="districts" element={<DistrictAnalytics />} />
            <Route path="skills" element={<SkillAnalytics />} />
            <Route path="training-effectiveness" element={<TrainingEffectiveness />} />
            <Route path="employment" element={<EmploymentReports />} />
            <Route path="reports" element={<Reports />} />
            <Route path="details/:metric" element={<MetricDetails />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
