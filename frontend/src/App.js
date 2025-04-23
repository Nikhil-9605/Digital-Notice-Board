import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Login from './pages/Login';
import Register from './pages/Register';
import NoticeBoard from './pages/NoticeBoard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<NoticeBoard />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
