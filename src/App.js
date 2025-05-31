import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard'; // Placeholder
import { isAuthenticated } from './services/authService';
import Notifications from './pages/Notifications.jsx'; // ✅ Bootstrap version
import Promotions from './pages/Promotions';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
     <Route path="/notifications" element={<Notifications />} />
     <Route path="/promotions" element={<Promotions />} />



      </Routes>
    </Router>
  );
}

export default App;
