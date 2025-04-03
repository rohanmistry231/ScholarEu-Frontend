import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const correctPassword = '9829scholar@!2707'; // Hardcoded for demo; use secure method in production

  // Check localStorage on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
      // Store authentication in localStorage
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    // Clear authentication from localStorage
    localStorage.removeItem('isAuthenticated');
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handlePasswordSubmit} className="login-form">
          <label>
            Enter Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Manage the system below.</p>
      <div className="dashboard-grid">
        <Link to="/add-uni-form" className="dashboard-card">
          <h3>Add University</h3>
          <p>Create a new university entry</p>
        </Link>
        <Link to="/add-student-form" className="dashboard-card">
          <h3>Add Student Ambassador</h3>
          <p>Add a new student ambassador</p>
        </Link>
        <Link to="/add-review-form" className="dashboard-card">
          <h3>Add Review</h3>
          <p>Submit a new university review</p>
        </Link>
        <Link to="/add-scholarship-form" className="dashboard-card">
          <h3>Add Scholarship</h3>
          <p>Create a new scholarship entry</p>
        </Link>
        <Link to="/add-notification-form" className="dashboard-card">
          <h3>Add Notification</h3>
          <p>Create a new notification</p>
        </Link>
      </div>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default AdminPanel;