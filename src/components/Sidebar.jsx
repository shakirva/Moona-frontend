import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import {
  FaTachometerAlt, FaUsers, FaCoins, FaUserShield,
  FaBullhorn, FaCogs, FaChevronDown, FaGift, FaCubes
} from 'react-icons/fa';
import { useState } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(location.pathname.startsWith('/settings'));

  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/users', label: 'Users', icon: <FaUsers /> },
    { to: '/orders', label: 'Orders', icon: <FaCubes /> }, // ✅ Added Orders here
    { to: '/coins-history', label: 'Points History', icon: <FaCoins /> },
    { to: '/internal-users', label: 'Internal Users', icon: <FaUserShield /> },
    { to: '/promotions', label: 'Promotions', icon: <FaBullhorn /> },
    { to: '/coupons', label: 'Coupons', icon: <FaGift /> }, // ✅ Added Coupons here
  ];

  return (
    <div className="d-flex flex-column vh-100 p-4 border-end" style={{ width: '260px', backgroundColor: '#f8f9fa' }}>
      <h4 className="mb-4 fw-bold text-primary text-center border-bottom pb-3">Admin Panel</h4>

      <Nav className="flex-column gap-2">
        {navItems.map((item, idx) => (
          <Nav.Link
            as={Link}
            to={item.to}
            key={idx}
            className={`d-flex align-items-center gap-3 px-3 py-2 fw-semibold rounded 
              ${isActive(item.to) ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
          >
            <span className="fs-5">{item.icon}</span>
            <span>{item.label}</span>
          </Nav.Link>
        ))}

        {/* SETTINGS WITH SUBMENU */}
        <div>
          <div
            onClick={toggleSettings}
            className="d-flex align-items-center gap-3 px-3 py-2 fw-semibold rounded text-dark"
            style={{ cursor: 'pointer' }}
          >
            <span className="fs-5"><FaCogs /></span>
            <span className="flex-grow-1">Settings</span>
            <FaChevronDown
              style={{ transition: '0.3s', transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>

          {settingsOpen && (
            <Nav className="flex-column ms-4 mt-2">
              <Nav.Link
                as={Link}
                to="/settings/points-rules"
                className={`px-3 py-2 fw-semibold rounded 
                  ${isActive('/settings/points-rules') ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
              >
                Points Rules
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/settings/general"
                className={`px-3 py-2 fw-semibold rounded 
                  ${isActive('/settings/general') ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
              >
                General Settings
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/settings/delivery-locations"
                className={`px-3 py-2 fw-semibold rounded 
                  ${isActive('/settings/delivery-locations') ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
              >
                Delivery Locations
              </Nav.Link>
            </Nav>
          )}
        </div>
      </Nav>
    </div>
  );
}
