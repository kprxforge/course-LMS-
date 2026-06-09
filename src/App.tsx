import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { KnowledgeBackground } from './components/layout/KnowledgeBackground';
import { motion } from 'motion/react';

import { Login } from './pages/Login';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';

import { Dashboard as StudentDashboard } from './pages/student/Dashboard';
import { CourseCatalog } from './pages/student/CourseCatalog';
import { CoursePlayer } from './pages/student/CoursePlayer';
import { Achievements } from './pages/student/Achievements';
import { Settings } from './pages/student/Settings';
import { Certificates } from './pages/student/Certificates';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminMaterials } from './pages/admin/AdminMaterials';
import { AdminQuizzes } from './pages/admin/AdminQuizzes';
import { AdminCertificates } from './pages/admin/AdminCertificates';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminAchievements } from './pages/admin/AdminAchievements';
import { AdminSettings } from './pages/admin/AdminSettings';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ease-in-out"
      >
        <KnowledgeBackground />
      </motion.div>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute role="student"><MainLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<CourseCatalog />} />
              <Route path="courses/:id" element={<CoursePlayer />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="settings" element={<Settings />} />
              <Route path="certificates" element={<Certificates />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="materials" element={<AdminMaterials />} />
              <Route path="quizzes" element={<AdminQuizzes />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
    </ThemeProvider>
  );
}
