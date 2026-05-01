import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    // Store userId and dummy token in localStorage
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', 'dummy-token-' + userId);

    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Trip Planner</h1>
        <p className="subtitle">Sign in with your user ID</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter your user ID (e.g., user123)"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError(''); // Clear error when user types
              }}
              className={error ? 'input-error' : ''}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="info-text">
          💡 For demo: Enter any user ID (e.g., "user1", "alice", "bob")
        </p>
      </div>
    </div>
  );
}
