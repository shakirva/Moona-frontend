import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import CoinsHistory from './pages/CoinsHistory';
import InternalUsers from './pages/InternalUsers';
import Notifications from './pages/Notifications';
import Promotions from './pages/Promotions';
import Layout from './components/Layout';
import { isAuthenticated } from './services/authService';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Layout */}
        <Route
          path="/"
          element={<PrivateRoute><Layout /></PrivateRoute>}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="coins-history" element={<CoinsHistory />} />
          <Route path="internal-users" element={<InternalUsers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="promotions" element={<Promotions />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
