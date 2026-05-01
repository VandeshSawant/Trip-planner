import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserTrips, createTrip, joinTrip } from '../services/tripService';
import CreateTripModal from './CreateTripModal';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  // Fetch trips when component mounts
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const userTrips = await fetchUserTrips();
      setTrips(userTrips);
    } catch (err) {
      setError('Failed to load trips. Please try again.');
      console.error('Error loading trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateTrip = () => {
    setShowCreateModal(true);
  };

  const handleTripCreated = async (tripData) => {
    console.log('🔍 DEBUG: handleTripCreated called with:', tripData);
    const createdTrip = await createTrip(tripData);
    const createdTripId = createdTrip.id || createdTrip.tripId;
    console.log('✅ DEBUG: Created trip ID:', createdTripId);
    await joinTrip(createdTripId);
    console.log('✅ DEBUG: Joined created trip');
    // Refresh the trips list
    await loadTrips();
    console.log('✅ DEBUG: Trips list refreshed');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Trips</h1>
        <div className="header-actions">
          <button onClick={handleCreateTrip} className="btn-primary">
            + Create Trip
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your trips...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadTrips} className="btn-secondary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="trips-grid">
            {trips.length === 0 ? (
              <div className="empty-state">
                <h2>No trips yet</h2>
                <p>Create your first trip to get started!</p>
                <button onClick={handleCreateTrip} className="btn-primary">
                  Create Your First Trip
                </button>
              </div>
            ) : (
              trips.map((trip) => (
                <div key={trip.id || trip.tripId} className="trip-card">
                  <h3>{trip.tripName}</h3>
                  <p className="trip-destination">{trip.destination}</p>
                  <p className="trip-dates">
                    {new Date(trip.startDate).toLocaleDateString('en-GB')} - {new Date(trip.endDate).toLocaleDateString('en-GB')}
                  </p>
                  <div className="trip-actions">
                    <button onClick={() => navigate(`/trip/${trip.id || trip.tripId}`)} className="btn-outline">
                      View Details
                    </button>
                    <button className="btn-outline">Manage Members</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <CreateTripModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTripCreated={handleTripCreated}
      />
    </div>
  );
}
