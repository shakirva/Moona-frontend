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
import PointsRules from './pages/Settings/PointsRules';
import GeneralSettings from './pages/Settings/GeneralSettings'; // ⬅️ Add this
import DeliveryLocations from './pages/Settings/DeliveryLocations';
import Coupons from './pages/Coupons';



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
          <Route path="/settings/points-rules" element={<PointsRules />} />
<Route path="/settings/general" element={<GeneralSettings />} />
<Route path="/settings/delivery-locations" element={<DeliveryLocations />} />
<Route path="/coupons" element={<Coupons />} />



        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
