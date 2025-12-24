import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Forms.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="MANAGER" activeItem="users" />
      <div className="main-content">
        <div className="header">
          <h1>All Users</h1>
          <p>Manage all registered users</p>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Account Number</th>
                <th>Account Type</th>
                <th>Balance</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.accountNumber}</td>
                    <td>{user.accountType}</td>
                    <td>₹{user.accountBalance}</td>
                    <td>{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <h3>No users found</h3>
                    <p>No users are registered in the system.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
  );
};

export default AllUsers;