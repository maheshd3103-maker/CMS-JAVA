import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const userAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  getUserById: (userId) => api.get(`/user/${userId}`),
  getAllUsers: () => api.get('/manager/users'),
  getManagerDashboard: () => api.get('/manager/dashboard'),
};

// Complaint API calls
export const complaintAPI = {
  submitComplaint: (complaintData) => api.post('/complaint/submit', complaintData),
  getMyComplaints: (userId) => api.get(`/complaint/my-complaints/${userId}`),
  trackComplaint: (trackingId) => api.get(`/complaint/track/${trackingId}`),
  getActiveComplaints: () => api.get('/complaint/active'),
  getComplaintHistory: () => api.get('/complaint/history'),
  getComplaintDetails: (id) => api.get(`/complaint/details/${id}`),
  updateComplaintStatus: (data) => api.post('/complaint/update-status', data),
};

export default api;