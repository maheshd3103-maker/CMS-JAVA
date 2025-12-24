import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Forms.css';

const RaiseComplaint = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    complaintType: '',
    complaintDescription: '',
    issueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await complaintAPI.submitComplaint({
        ...formData,
        userId: userId
      });
      
      // Show success message with tracking ID
      alert(`Complaint submitted successfully! Your tracking ID is: ${response.data.trackingId}`);
      navigate(`/user/dashboard/${userId}`);
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to submit complaint. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="USER" userId={userId} activeItem="raise" />
      <div className="main-content">
        <div className="header">
          <h1>Raise a Complaint</h1>
          <p>Submit your complaint details</p>
        </div>
        
        <div className="form-card">
          <h2>Complaint Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="complaintType">Type of Complaint</label>
              <select
                id="complaintType"
                name="complaintType"
                value={formData.complaintType}
                onChange={handleChange}
                required
              >
                <option value="">Select complaint type</option>
                <option value="billing">Billing Issue</option>
                <option value="service">Service Issue</option>
                <option value="technical">Technical Issue</option>
                <option value="account">Account Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="complaintDescription">Complaint Description</label>
              <textarea
                id="complaintDescription"
                name="complaintDescription"
                value={formData.complaintDescription}
                onChange={handleChange}
                placeholder="Describe your complaint in detail..."
                rows="5"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="issueDate">Date of Issue</label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
            
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;