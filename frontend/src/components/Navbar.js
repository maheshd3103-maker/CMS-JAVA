import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// Header markup matching homepage.html: left logo "CMS" and right auth buttons (FAQ, Login, Sign In)
const Navbar = () => {
  return (
    <header className="site-navbar">
      <div className="site-container">
        <div className="logo">CMS</div>
        <div className="auth-buttons">
          <Link to="/faq" className="btn-login" style={{ marginRight: '10px' }}>FAQ</Link>
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/signin" className="btn-signin">Sign In</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
