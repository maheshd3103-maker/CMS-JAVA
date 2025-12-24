import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Forms.css';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await complaintAPI.getComplaintDetails(id);
        setComplaint(response.data);
      } catch (error) {
        console.error('Error fetching complaint:', error);
        navigate('/complaint/active');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await complaintAPI.updateComplaintStatus({
        complaintId: complaint.complaintId,
        status: newStatus
      });
      setComplaint({ ...complaint, status: newStatus });
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'pending';
      case 'in progress': return 'in-progress';
      case 'resolved': return 'resolved';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!complaint) {
    return <div className="error">Complaint not found</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="MANAGER" activeItem="active" />
      <div className="main-content">
        <div className="header">
          <h1>Complaint Details</h1>
          <p>View and manage complaint information</p>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/complaint/active')}
          >
            Back to Active Complaints
          </button>
        </div>
        
        <div className="complaint-result">
          <div className="complaint-header">
            <div className="complaint-id">Tracking ID: {complaint.trackingId}</div>
            <span className={`status ${getStatusClass(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
          
          <div className="detail-section">
            <div className="detail-row">
              <div className="detail-label">Customer Name:</div>
              <div className="detail-value">{complaint.user?.username}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Customer Email:</div>
              <div className="detail-value">{complaint.user?.email}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Account Number:</div>
              <div className="detail-value">{complaint.user?.accountNumber}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Complaint Type:</div>
              <div className="detail-value">{complaint.complaintType}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Description:</div>
              <div className="detail-value">{complaint.complaintDescription}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Issue Date:</div>
              <div className="detail-value">{complaint.issueDate}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Submitted Date:</div>
              <div className="detail-value">{complaint.submittedDate}</div>
            </div>
            {complaint.resolvedDate && (
              <div className="detail-row">
                <div className="detail-label">Resolved Date:</div>
                <div className="detail-value">{complaint.resolvedDate}</div>
              </div>
            )}
          </div>
          
          <div className="detail-section">
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Update Status</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-warning"
                onClick={() => handleStatusUpdate('Pending')}
                disabled={updating || complaint.status === 'Pending'}
              >
                Mark as Pending
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleStatusUpdate('In Progress')}
                disabled={updating || complaint.status === 'In Progress'}
              >
                Mark as In Progress
              </button>
              <button 
                className="btn btn-success"
                onClick={() => handleStatusUpdate('Resolved')}
                disabled={updating || complaint.status === 'Resolved'}
              >
                Mark as Resolved
              </button>
            </div>
            {updating && <p style={{ marginTop: '10px', color: '#3498db' }}>Updating status...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;