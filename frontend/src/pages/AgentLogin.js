import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';

const AgentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/agent/login?email=${email}&password=${password}`);
            
            if (response.ok) {
                const agentData = await response.json();
                localStorage.setItem('agentData', JSON.stringify(agentData));
                navigate('/agent-dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Agent Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Login</button>
                </form>
                <p>
                    <a href="/login">Back to User Login</a>
                </p>
            </div>
        </div>
    );
};

export default AgentLogin;