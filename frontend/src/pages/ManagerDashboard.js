import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Dashboard.css';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userAPI.getManagerDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="error">Failed to load dashboard data</div>;
  }

  const complaintTypeData = [
    { name: 'Billing', count: dashboardData.billingCount },
    { name: 'Service', count: dashboardData.serviceCount },
    { name: 'Technical', count: dashboardData.technicalCount },
    { name: 'Account', count: dashboardData.accountCount },
    { name: 'Other', count: dashboardData.otherCount },
  ];

  const statusData = [
    { name: 'Pending', count: dashboardData.pendingCount },
    { name: 'In Progress', count: dashboardData.inProgressCount },
    { name: 'Resolved', count: dashboardData.closedCount },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="MANAGER" activeItem="dashboard" />
      <div className="main-content">
        <div className="header">
          <h1>Welcome, Manager!</h1>
          <p>Monitor and manage all complaints from your central dashboard</p>
        </div>
        
        <div className="stats-container">
          <div className="stat-card active">
            <div className="stat-number">{dashboardData.activeCount}</div>
            <div className="stat-label">Active Complaints</div>
          </div>
          <div className="stat-card closed">
            <div className="stat-number">{dashboardData.closedCount}</div>
            <div className="stat-label">Closed Complaints</div>
          </div>
          <div className="stat-card users">
            <div className="stat-number">{dashboardData.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{dashboardData.pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card progress">
            <div className="stat-number">{dashboardData.inProgressCount}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card closed">
            <div className="stat-number">{dashboardData.closedCount}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        
        <div className="analytics-section">
          <h2>📊 Analytics & Reports</h2>
          <div className="chart-box">
            <div className="chart-title">Complaints by Type</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2c3e50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-box" style={{ marginTop: '30px' }}>
            <div className="chart-title">Status Distribution</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="analytics-section">
          <h2>📈 Resolution Timeline</h2>
          <div className="chart-box">
            <div className="chart-title">Complaints Resolved Over Time (Last 7 Days)</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#27ae60" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="avg-time">
              Average Resolution Time: {dashboardData.avgResolutionTime} days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;