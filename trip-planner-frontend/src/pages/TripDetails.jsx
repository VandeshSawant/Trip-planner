import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTripDetails } from "../services/tripService";
import "../styles/TripDetails.css";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const tripData = await fetchTripDetails(id);
      setTrip(tripData);
    } catch (err) {
      setError("Failed to load trip details. Please try again.");
      console.error("Error loading trip details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTripDetails();
  }, [loadTripDetails]);

  if (loading) {
    return (
      <div className="trip-details-page">
        <div className="trip-details-loading">
          <div className="spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-details-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadTripDetails} className="btn btn-secondary">
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-details-page">
        <p>Trip not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="trip-details-page">
      <header className="trip-details-header">
        <button
          onClick={() => navigate("/dashboard")}
          className="trip-details-back-btn"
        >
          ← Back to Dashboard
        </button>
        <h1>{trip.tripName}</h1>
        <p className="trip-details-destination">{trip.destination}</p>
        <p className="trip-details-dates">
          {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
          {new Date(trip.endDate).toLocaleDateString("en-GB")}
        </p>
      </header>

      <main className="trip-details-content">
        <section className="trip-members-card">
          <h2>Trip Members</h2>
          {trip.members && trip.members.length > 0 ? (
            <ul className="members-list">
              {trip.members.map((member) => (
                <li key={member.userId} className="trip-member-item">
                  <div className="trip-member-info">
                    <span className="trip-member-name">{member.name}</span>
                    <span className="trip-member-joined">
                      Joined:{" "}
                      {new Date(member.joinedAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No members have joined this trip yet.</p>
          )}
        </section>

        <section className="trip-itinerary-card">
          <h2>Itinerary</h2>
          {trip.itinerary && trip.itinerary.length > 0 ? (
            <div className="trip-itinerary-list">
              {trip.itinerary.map((item) => (
                <div key={item.id} className="trip-itinerary-item">
                  <div className="trip-itinerary-date">
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </div>
                  <div className="trip-itinerary-details">
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
