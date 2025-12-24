import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Forms.css';

const MyComplaints = () => {
  const { userId } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintAPI.getMyComplaints(userId);
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userId]);

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
      <Sidebar userRole="USER" userId={userId} activeItem="my-complaints" />
      <div className="main-content">
        <div className="header">
          <h1>My Complaints</h1>
          <p>View all your raised complaints</p>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Issue Date</th>
                <th>Submitted Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint.complaintId}>
                    <td className="tracking-id">{complaint.trackingId}</td>
                    <td>{complaint.complaintType}</td>
                    <td>{complaint.complaintDescription}</td>
                    <td>{complaint.issueDate}</td>
                    <td>{complaint.submittedDate}</td>
                    <td>
                      <span className={`status ${getStatusClass(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <h3>No complaints found</h3>
                    <p>You haven't raised any complaints yet.</p>
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

export default MyComplaints;