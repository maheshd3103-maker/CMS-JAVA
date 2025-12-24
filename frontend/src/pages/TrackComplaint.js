import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Forms.css';

const TrackComplaint = () => {
  const { userId } = useParams();
  const [trackingId, setTrackingId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const response = await complaintAPI.trackComplaint(trackingId);
      setComplaint(response.data);
    } catch (error) {
      setError('Complaint ID not found. Please check and try again.');
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="USER" userId={userId} activeItem="track" />
      <div className="main-content">
        <div className="header">
          <h1>Track Complaints</h1>
          <p>Enter your complaint ID to check status</p>
        </div>
        
        <div className="search-box">
          <h3>Track Your Complaint</h3>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="trackingId">Complaint ID:</label>
              <input
                type="text"
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Complaint ID (e.g., CMS12345)"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Tracking...' : 'Track Complaint'}
            </button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>

        {complaint && (
          <div className="complaint-result">
            <div className="complaint-header">
              <div className="complaint-id">Tracking ID: {complaint.trackingId}</div>
              <span className={`status ${getStatusClass(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            
            <div className="detail-section">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;