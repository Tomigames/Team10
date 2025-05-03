
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Course from './Course';
import CourseList from './Course';
import CreateCourse from './CreateCourse';
import EditCourse from './EditCourse';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import { UserContext, UserProvider } from './UserContext';
import React, { useContext } from 'react';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { userId } = useContext(UserContext);
  return userId ? children : <Navigate to="/login" />;
};

function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
  );
}

export default App;
