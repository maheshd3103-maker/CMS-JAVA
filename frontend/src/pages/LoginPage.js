import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await userAPI.login(formData);
      const { user } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'MANAGER') {
        navigate('/manager/dashboard');
      } else {
        navigate(`/user/dashboard/${user.userId}`);
      }
    } catch (userError) {
      try {
        const agentResponse = await fetch(`http://localhost:8080/api/agent/login?email=${formData.email}&password=${formData.password}`);
        
        if (agentResponse.ok) {
          const agentData = await agentResponse.json();
          localStorage.setItem('agentData', JSON.stringify(agentData));
          navigate('/agent-dashboard');
        } else {
          setError('Invalid email or password');
        }
      } catch (agentError) {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
      background: '#2c3e50',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '24px'
        }}>Complaint Management System</h1>
        
        <h2 style={{
          textAlign: 'center',
          color: '#555',
          marginBottom: '30px',
          fontSize: '20px'
        }}>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontWeight: '500'
            }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontWeight: '500'
            }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#bdc3c7' : '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          {error && (
            <div style={{
              color: '#e74c3c',
              fontSize: '14px',
              marginTop: '10px',
              textAlign: 'center'
            }}>{error}</div>
          )}
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <p style={{ color: '#555', margin: 0 }}>
            Don't have an account? <a href="/signin" style={{
              color: '#2c3e50',
              textDecoration: 'none'
            }}>Sign In</a>
          </p>
        </div>
      </div>
      </div>
    );
};

export default LoginPage;