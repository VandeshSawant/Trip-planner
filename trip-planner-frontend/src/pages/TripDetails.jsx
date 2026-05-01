import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTripDetails } from '../services/tripService';
import '../styles/TripDetails.css';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTripDetails();
  }, [id]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const tripData = await fetchTripDetails(id);
      setTrip(tripData);
    } catch (err) {
      setError('Failed to load trip details. Please try again.');
      console.error('Error loading trip details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="trip-details">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-details">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadTripDetails} className="btn-secondary">
            Try Again
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-details">
        <p>Trip not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="trip-details">
      <header className="trip-details-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>{trip.tripName}</h1>
        <p className="trip-destination">{trip.destination}</p>
        <p className="trip-dates">
          {new Date(trip.startDate).toLocaleDateString('en-GB')} - {new Date(trip.endDate).toLocaleDateString('en-GB')}
        </p>
      </header>

      <main className="trip-details-content">
        <section className="trip-members">
          <h2>Trip Members</h2>
          {trip.members && trip.members.length > 0 ? (
            <ul className="members-list">
              {trip.members.map((member) => (
                <li key={member.userId} className="member-item">
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-joined">Joined: {new Date(member.joinedAt).toLocaleDateString('en-GB')}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No members have joined this trip yet.</p>
          )}
        </section>

        <section className="trip-itinerary">
          <h2>Itinerary</h2>
          {trip.itinerary && trip.itinerary.length > 0 ? (
            <div className="itinerary-list">
              {trip.itinerary.map((item) => (
                <div key={item.id} className="itinerary-item">
                  <div className="itinerary-date">
                    {new Date(item.date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="itinerary-details">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No itinerary planned yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}