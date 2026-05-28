import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserTrips, createTrip } from "../services/tripService";
import CreateTripModal from "./CreateTripModal";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const userTrips = await fetchUserTrips();
      setTrips(userTrips);
    } catch (err) {
      setError("Failed to load trips. Please try again.");
      console.error("Error loading trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleCreateTrip = () => {
    setShowCreateModal(true);
  };

  const handleTripCreated = async (tripData) => {
    console.log("🔍 DEBUG: handleTripCreated called with:", tripData);
    const createdTrip = await createTrip(tripData);
    const createdTripId = createdTrip.id || createdTrip.tripId;
    console.log("✅ DEBUG: Created trip ID:", createdTripId);
    await loadTrips();
    console.log("✅ DEBUG: Trips list refreshed");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>My Trips</h1>
        <div className="dashboard-header-actions">
          <button onClick={handleCreateTrip} className="btn btn-primary">
            + Create Trip
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {loading && (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Loading your trips...</p>
          </div>
        )}

        {error && (
          <div className="dashboard-error-box">
            <p>{error}</p>
            <button onClick={loadTrips} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="dashboard-trips-grid">
            {trips.length === 0 ? (
              <div className="dashboard-empty-state">
                <h2>No trips yet</h2>
                <p>Create your first trip to get started!</p>
                <button onClick={handleCreateTrip} className="btn btn-primary">
                  Create Your First Trip
                </button>
              </div>
            ) : (
              trips.map((trip) => (
                <div
                  key={trip.id || trip.tripId}
                  className="dashboard-trip-card"
                >
                  <h3>{trip.tripName}</h3>
                  <p className="dashboard-trip-destination">
                    {trip.destination}
                  </p>
                  <p className="dashboard-trip-dates">
                    {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(trip.endDate).toLocaleDateString("en-GB")}
                  </p>
                  <div className="dashboard-trip-actions">
                    <button
                      onClick={() =>
                        navigate(`/trip/${trip.id || trip.tripId}`)
                      }
                      className="dashboard-card-btn-primary"
                    >
                      View Details
                    </button>
                    <button className="dashboard-card-btn-secondary">
                      Manage Members
                    </button>
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
