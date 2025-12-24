import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Forms.css';

const ActiveComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [sortedComplaints, setSortedComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintAPI.getActiveComplaints();
        setComplaints(response.data);
        setSortedComplaints(response.data.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)));
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    const sorted = [...complaints].sort((a, b) => {
      return newOrder === 'desc' 
        ? new Date(b.issueDate) - new Date(a.issueDate)
        : new Date(a.issueDate) - new Date(b.issueDate);
    });
    setSortedComplaints(sorted);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'in progress': return 'in-progress';
      case 'resolved': return 'resolved';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="MANAGER" activeItem="active" />
      <div className="main-content">
        <div className="header">
          <h1>Active Complaints</h1>
          <p>Manage all active complaints</p>
          <button 
            className="btn btn-secondary"
            onClick={handleSort}
          >
            Sort by Date ({sortOrder === 'desc' ? 'Newest First' : 'Oldest First'})
          </button>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Description</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedComplaints.length > 0 ? (
                sortedComplaints.map((complaint) => (
                  <tr key={complaint.complaintId}>
                    <td className="tracking-id">{complaint.trackingId}</td>
                    <td>{complaint.user?.username}</td>
                    <td>{complaint.complaintType}</td>
                    <td>{complaint.complaintDescription}</td>
                    <td>{complaint.issueDate}</td>
                    <td>
                      <span className={`status ${getStatusClass(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/complaint/details/${complaint.complaintId}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <h3>No active complaints</h3>
                    <p>All complaints have been resolved.</p>
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

export default ActiveComplaints;