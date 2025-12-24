import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const UserDashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getUserById(userId);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="USER" userId={userId} activeItem="dashboard" />
      <div className="main-content">
        <div className="header">
          <h1>Welcome, {user.username}!</h1>
          <p>Manage your account and complaints from your dashboard</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/complaint/raise/${userId}`)}
          >
            Raise a Complaint
          </button>
        </div>
        
        <div className="info-card">
          <h2>Account Details</h2>
          <div className="info-row">
            <div className="info-label">Account Number:</div>
            <div className="info-value">{user.accountNumber}</div>
          </div>
          <div className="info-row">
            <div className="info-label">User Name:</div>
            <div className="info-value">{user.username}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Account Balance:</div>
            <div className="info-value">₹{user.accountBalance}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Account Type:</div>
            <div className="info-value">{user.accountType}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;