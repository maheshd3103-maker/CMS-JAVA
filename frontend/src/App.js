import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignInPage from './pages/SignInPage';
import UserDashboard from './pages/UserDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AgentLogin from './pages/AgentLogin';
import AgentDashboard from './pages/AgentDashboard';
import RaiseComplaint from './pages/RaiseComplaint';
import TrackComplaint from './pages/TrackComplaint';
import MyComplaints from './pages/MyComplaints';
import ActiveComplaints from './pages/ActiveComplaints';
import ComplaintHistory from './pages/ComplaintHistory';
import AllUsers from './pages/AllUsers';
import ComplaintDetails from './pages/ComplaintDetails';
import FAQ from './pages/FAQ';
import Navbar from './components/Navbar';

const AppWrapper = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/agent-login" element={<AgentLogin />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/user/dashboard/:userId" element={<UserDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/complaint/raise/:userId" element={<RaiseComplaint />} />
        <Route path="/complaint/track/:userId" element={<TrackComplaint />} />
        <Route path="/complaint/my-complaints/:userId" element={<MyComplaints />} />
        <Route path="/complaint/active" element={<ActiveComplaints />} />
        <Route path="/complaint/history" element={<ComplaintHistory />} />
        <Route path="/complaint/details/:id" element={<ComplaintDetails />} />
        <Route path="/manager/users" element={<AllUsers />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};


function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;