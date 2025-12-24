import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Dashboard.css';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [submittedComplaints, setSubmittedComplaints] = useState([]);
  const [solvedComplaints, setSolvedComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
    fetchSubmittedComplaints();
    fetchSolvedComplaints();
  }, []);

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

  const fetchSubmittedComplaints = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/manager/complaints/submitted');
      const data = await response.json();
      setSubmittedComplaints(data);
    } catch (error) {
      console.error('Error fetching submitted complaints:', error);
    }
  };

  const fetchSolvedComplaints = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/manager/complaints/solved');
      const data = await response.json();
      setSolvedComplaints(data);
    } catch (error) {
      console.error('Error fetching solved complaints:', error);
    }
  };

  const fetchAgentsByDepartment = async (department) => {
    try {
      const response = await fetch(`http://localhost:8080/api/manager/agents/department/${department}`);
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const assignComplaint = async () => {
    if (!selectedComplaint) {
      alert('Please select a complaint');
      return;
    }

    // For "Other" complaints, no agent selection needed
    if (selectedComplaint.complaintType !== 'Other' && !selectedAgent) {
      alert('Please select an agent');
      return;
    }

    try {
      const requestBody = {
        complaintId: selectedComplaint.complaintId,
        managerName: 'Manager'
      };
      
      // Only add agentId for non-Other complaints
      if (selectedComplaint.complaintType !== 'Other') {
        requestBody.agentId = selectedAgent;
      }

      const response = await fetch('http://localhost:8080/api/manager/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        setSelectedComplaint(null);
        setSelectedAgent('');
        setAgents([]);
        fetchSubmittedComplaints();
      } else {
        alert('Failed to assign complaint');
      }
    } catch (error) {
      console.error('Error assigning complaint:', error);
      alert('Error assigning complaint');
    }
  };

  const resolveComplaint = async (complaintId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/manager/resolve/${complaintId}`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Complaint resolved successfully');
        fetchSolvedComplaints();
      } else {
        alert('Failed to resolve complaint');
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  const handleComplaintSelect = (complaint) => {
    setSelectedComplaint(complaint);
    
    // If complaint type is "Other", manager handles directly
    if (complaint.complaintType === 'Other') {
      assignComplaint();
      return;
    }
    
    // Map complaint type to department
    const departmentMap = {
      'Technical': 'TECHNICAL',
      'Billing': 'BILLING',
      'Service': 'SERVICES',
      'Account': 'ACCOUNT'
    };
    const department = departmentMap[complaint.complaintType] || 'TECHNICAL';
    fetchAgentsByDepartment(department);
  };

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
          <h1>Manager Dashboard</h1>
          <div className="tab-buttons">
            <button 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={activeTab === 'assignments' ? 'active' : ''}
              onClick={() => setActiveTab('assignments')}
            >
              Assign Complaints
            </button>
            <button 
              className={activeTab === 'approvals' ? 'active' : ''}
              onClick={() => setActiveTab('approvals')}
            >
              Approve Resolutions
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
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
                <div className="stat-number">{submittedComplaints.length}</div>
                <div className="stat-label">Awaiting Assignment</div>
              </div>
              <div className="stat-card progress">
                <div className="stat-number">{solvedComplaints.length}</div>
                <div className="stat-label">Awaiting Approval</div>
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
            </div>
          </>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <h2>Assign Complaints to Agents</h2>
            <div className="complaints-grid">
              <div className="complaints-list">
                <h3>Submitted Complaints</h3>
                <table className="complaints-table">
                  <thead>
                    <tr>
                      <th>Tracking ID</th>
                      <th>Type</th>
                      <th>User</th>
                      <th>Submitted Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedComplaints.map(complaint => (
                      <tr key={complaint.complaintId}>
                        <td>{complaint.trackingId}</td>
                        <td>{complaint.complaintType}</td>
                        <td>{complaint.user.username}</td>
                        <td>{complaint.submittedDate}</td>
                        <td>
                          <button onClick={() => handleComplaintSelect(complaint)}>
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedComplaint && selectedComplaint.complaintType !== 'Other' && (
                <div className="assignment-panel">
                  <h3>Assign Complaint: {selectedComplaint.trackingId}</h3>
                  <p><strong>Type:</strong> {selectedComplaint.complaintType}</p>
                  <p><strong>Description:</strong> {selectedComplaint.complaintDescription}</p>
                  
                  <div className="agent-selection">
                    <label>Select Agent:</label>
                    <select 
                      value={selectedAgent} 
                      onChange={(e) => setSelectedAgent(e.target.value)}
                    >
                      <option value="">Choose an agent...</option>
                      {agents.map(agent => (
                        <option key={agent.agentId} value={agent.agentId}>
                          {agent.agentName} - {agent.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="assignment-actions">
                    <button onClick={assignComplaint}>Assign Complaint</button>
                    <button onClick={() => setSelectedComplaint(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="approvals-section">
            <h2>Approve Solved Complaints</h2>
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Type</th>
                  <th>Agent</th>
                  <th>Resolution Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {solvedComplaints.map(complaint => (
                  <tr key={complaint.complaintId}>
                    <td>{complaint.trackingId}</td>
                    <td>{complaint.complaintType}</td>
                    <td>{complaint.assignedAgent?.agentName || 'N/A'}</td>
                    <td>{complaint.resolutionNotes || 'No notes'}</td>
                    <td>
                      <button onClick={() => resolveComplaint(complaint.complaintId)}>
                        Approve & Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;