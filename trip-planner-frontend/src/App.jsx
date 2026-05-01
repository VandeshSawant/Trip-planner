import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import './App.css';

function App() {
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('userId');

  return (
    <Router>
      <Routes>
        {/* Login route - always accessible */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes will go here */}
        {/* For now, redirect root to login */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Dashboard route */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />

        {/* Trip Details route */}
        <Route path="/trip/:id" element={isLoggedIn ? <TripDetails /> : <Navigate to="/login" />} />

        {/* Catch-all - redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
