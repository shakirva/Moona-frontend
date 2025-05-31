// src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaUsers, FaCoins, FaUserShield, FaBell } from 'react-icons/fa'; // Add FaBell
import { FaTachometerAlt, FaUsers, FaCoins, FaUserShield, FaBullhorn } from 'react-icons/fa';


export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/users', label: 'Users', icon: <FaUsers /> },
    { to: '/coins-history', label: 'Coins History', icon: <FaCoins /> },
    { to: '/internal-users', label: 'Internal Users', icon: <FaUserShield /> },
    { to: '/notifications', label: 'Notifications', icon: <FaBell /> }, // ✅ NEW
    { to: '/promotions', label: 'Promotions', icon: <FaBullhorn /> },

  ];

  return (
    <div className="d-flex flex-column vh-100 p-4 border-end" style={{ width: '260px', backgroundColor: '#f8f9fa' }}>
      <h4 className="mb-4 fw-bold text-primary text-center border-bottom pb-3">Admin Panel</h4>
      <Nav className="flex-column gap-2">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.to;
          return (
            <Nav.Link
              as={Link}
              to={item.to}
              key={idx}
              className={`d-flex align-items-center gap-3 px-3 py-2 fw-semibold rounded ${isActive ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
            >
              <span className="fs-5">{item.icon}</span>
              <span>{item.label}</span>
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}
