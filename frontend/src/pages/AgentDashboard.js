import React, { useState, useEffect } from 'react';
import './AgentDashboard.css';

const AgentDashboard = () => {
    const [agent, setAgent] = useState(null);
    const [activeComplaints, setActiveComplaints] = useState([]);
    const [complaintHistory, setComplaintHistory] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        const agentData = JSON.parse(localStorage.getItem('agentData'));
        if (agentData) {
            setAgent(agentData);
            fetchActiveComplaints(agentData.agentId);
            fetchComplaintHistory(agentData.agentId);
            fetchStats(agentData.agentId);
        }
    }, []);

    const fetchActiveComplaints = async (agentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/agent/${agentId}/complaints`);
            const data = await response.json();
            const active = data.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'SOLVED'].includes(c.status));
            setActiveComplaints(active);
        } catch (error) {
            console.error('Error fetching active complaints:', error);
        }
    };

    const fetchComplaintHistory = async (agentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/agent/${agentId}/complaints/history`);
            const data = await response.json();
            setComplaintHistory(data);
        } catch (error) {
            console.error('Error fetching complaint history:', error);
        }
    };

    const fetchStats = async (agentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/agent/${agentId}/dashboard/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const startWorking = async (complaintId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/agent/complaint/${complaintId}/start`, {
                method: 'POST'
            });
            if (response.ok) {
                alert('Started working on complaint');
                fetchActiveComplaints(agent.agentId);
                fetchStats(agent.agentId);
            }
        } catch (error) {
            console.error('Error starting work:', error);
        }
    };

    const solveComplaint = async (complaintId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/agent/complaint/${complaintId}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ resolutionNotes })
            });
            if (response.ok) {
                alert('Complaint marked as solved');
                setSelectedComplaint(null);
                setResolutionNotes('');
                fetchActiveComplaints(agent.agentId);
                fetchStats(agent.agentId);
            }
        } catch (error) {
            console.error('Error solving complaint:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('agentData');
        window.location.href = '/login';
    };

    if (!agent) {
        return (
            <div className="auth-container">
                <div className="auth-form">
                    <h2>Please login as an agent</h2>
                    <button onClick={() => window.location.href = '/login'}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="agent-dashboard">
            <div className="agent-container">
                <div className="agent-header">
                    <div className="agent-header-info">
                        <h1>Agent Dashboard</h1>
                        <p>Welcome, {agent.agentName}</p>
                        <span className="agent-department-badge">{agent.department} Department</span>
                    </div>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Assigned</h3>
                        <p>{stats.totalAssigned || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active Tasks</h3>
                        <p>{activeComplaints.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Solved</h3>
                        <p>{stats.solved || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed</h3>
                        <p>{complaintHistory.length}</p>
                    </div>
                </div>

                <div className="tab-navigation">
                    <button 
                        className={activeTab === 'active' ? 'tab-btn active' : 'tab-btn'}
                        onClick={() => setActiveTab('active')}
                    >
                        Active Complaints ({activeComplaints.length})
                    </button>
                    <button 
                        className={activeTab === 'history' ? 'tab-btn active' : 'tab-btn'}
                        onClick={() => setActiveTab('history')}
                    >
                        Complaint History ({complaintHistory.length})
                    </button>
                </div>

                {activeTab === 'active' && (
                    <div className="complaints-section">
                        <h2>🎯 Active Complaints</h2>
                        {activeComplaints.length > 0 ? (
                            <table className="complaints-table">
                                <thead>
                                    <tr>
                                        <th>Tracking ID</th>
                                        <th>Type</th>
                                        <th>User</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeComplaints.map(complaint => (
                                        <tr key={complaint.complaintId}>
                                            <td><strong>{complaint.trackingId}</strong></td>
                                            <td>{complaint.complaintType}</td>
                                            <td>{complaint.user?.username || 'N/A'}</td>
                                            <td>{complaint.complaintDescription.substring(0, 50)}...</td>
                                            <td>
                                                <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td>{complaint.submittedDate}</td>
                                            <td>
                                                {complaint.status === 'ASSIGNED' && (
                                                    <button 
                                                        className="action-btn start"
                                                        onClick={() => startWorking(complaint.complaintId)}
                                                    >
                                                        Start Working
                                                    </button>
                                                )}
                                                {complaint.status === 'IN_PROGRESS' && (
                                                    <button 
                                                        className="action-btn solve"
                                                        onClick={() => setSelectedComplaint(complaint)}
                                                    >
                                                        Mark as Solved
                                                    </button>
                                                )}
                                                {complaint.status === 'SOLVED' && (
                                                    <span className="waiting-text">⏳ Awaiting Manager Approval</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-data">📋 No active complaints assigned to you.</div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="complaints-section">
                        <h2>📚 Complaint History</h2>
                        {complaintHistory.length > 0 ? (
                            <table className="complaints-table">
                                <thead>
                                    <tr>
                                        <th>Tracking ID</th>
                                        <th>Type</th>
                                        <th>User</th>
                                        <th>Description</th>
                                        <th>Resolution Notes</th>
                                        <th>Resolved Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaintHistory.map(complaint => (
                                        <tr key={complaint.complaintId}>
                                            <td><strong>{complaint.trackingId}</strong></td>
                                            <td>{complaint.complaintType}</td>
                                            <td>{complaint.user?.username || 'N/A'}</td>
                                            <td>{complaint.complaintDescription.substring(0, 50)}...</td>
                                            <td>{complaint.resolutionNotes || 'No notes provided'}</td>
                                            <td>{complaint.resolvedDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-data">📋 No resolved complaints yet.</div>
                        )}
                    </div>
                )}

                {selectedComplaint && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>🔧 Resolve Complaint</h3>
                            <div className="complaint-details">
                                <p><strong>Tracking ID:</strong> {selectedComplaint.trackingId}</p>
                                <p><strong>Type:</strong> {selectedComplaint.complaintType}</p>
                                <p><strong>User:</strong> {selectedComplaint.user?.username}</p>
                                <p><strong>Description:</strong> {selectedComplaint.complaintDescription}</p>
                            </div>
                            <div className="form-group">
                                <label>Resolution Notes</label>
                                <textarea
                                    placeholder="Provide detailed resolution notes..."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button 
                                    className="btn-primary"
                                    onClick={() => solveComplaint(selectedComplaint.complaintId)}
                                    disabled={!resolutionNotes.trim()}
                                >
                                    ✅ Mark as Solved
                                </button>
                                <button 
                                    className="btn-secondary"
                                    onClick={() => {
                                        setSelectedComplaint(null);
                                        setResolutionNotes('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;