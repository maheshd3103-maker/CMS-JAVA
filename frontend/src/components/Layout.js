import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="site-root">
      <header className="site-header">
        <div className="logo">CMS</div>
        <div className="auth-buttons">
          <Link to="/faq" className="btn-login" style={{ marginRight: '10px' }}>FAQ</Link>
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/signin" className="btn-signin">Sign In</Link>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <small>© {new Date().getFullYear()} Complaint Management System</small>
      </footer>
    </div>
  );
};

export default Layout;
