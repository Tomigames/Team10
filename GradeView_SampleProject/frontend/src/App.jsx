import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage       from './pages/HomePage.jsx';
import CourseListPage from './pages/CourseListPage.jsx';
import GradeWeightsPage from './pages/GradeWeightsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import { AuthProvider } from './context/AuthContext';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route
            path="/courses/:courseId/weights/:term"
            element={<GradeWeightsPage />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
