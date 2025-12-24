import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userRole, userId, activeItem }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const userMenuItems = [
    { key: 'dashboard', label: 'Account Information', path: `/user/dashboard/${userId}` },
    { key: 'raise', label: 'Raise a Complaint', path: `/complaint/raise/${userId}` },
    { key: 'my-complaints', label: 'My Complaints', path: `/complaint/my-complaints/${userId}` },
    { key: 'track', label: 'Track the Complaint', path: `/complaint/track/${userId}` },
  ];

  const managerMenuItems = [
    { key: 'dashboard', label: 'Dashboard', path: '/manager/dashboard' },
    { key: 'users', label: 'All Users', path: '/manager/users' },
    { key: 'active', label: 'Active Complaints', path: '/complaint/active' },
    { key: 'history', label: 'Complaint History', path: '/complaint/history' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'MANAGER': return managerMenuItems;
      default: return userMenuItems;
    }
  };

  const getHeaderTitle = () => {
    switch (userRole) {
      case 'MANAGER': return 'Manager Dashboard';
      default: return 'CMS Dashboard';
    }
  };

  const getHeaderPath = () => {
    switch (userRole) {
      case 'MANAGER': return '/manager/dashboard';
      default: return `/user/dashboard/${userId}`;
    }
  };

  const menuItems = getMenuItems();
  const headerTitle = getHeaderTitle();
  const headerPath = getHeaderPath();

  return (
    <div className="sidebar">
      <div>
        <div 
          className="sidebar-header" 
          onClick={() => handleNavigation(headerPath)}
        >
          {headerTitle}
        </div>
        <div className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${activeItem === item.key ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="logout" onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
};

export default Sidebar;