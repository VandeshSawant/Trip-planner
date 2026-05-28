import { useState } from "react";
import "../styles/CreateTripModal.css";

export default function CreateTripModal({ isOpen, onClose, onTripCreated }) {
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔍 DEBUG: Form submitted with data:", formData);

    if (!formData.tripName.trim()) {
      setError("Trip name is required");
      return;
    }
    if (!formData.destination.trim()) {
      setError("Destination is required");
      return;
    }
    if (!formData.startDate) {
      setError("Start date is required");
      return;
    }
    if (!formData.endDate) {
      setError("End date is required");
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("End date must be after start date");
      return;
    }

    console.log("✅ DEBUG: Validation passed, calling onTripCreated");

    try {
      setLoading(true);
      setError("");
      await onTripCreated(formData);
      console.log("✅ DEBUG: Trip created successfully, closing modal");
      setFormData({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
      });
      onClose();
    } catch (err) {
      console.error("❌ DEBUG: Error in handleSubmit:", err);
      setError("Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
      });
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-trip-modal-overlay" onClick={handleClose}>
      <div
        className="create-trip-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-trip-modal-header">
          <h2>Create New Trip</h2>
          <button
            type="button"
            className="create-trip-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="create-trip-form-group">
            <label htmlFor="tripName">Trip Name *</label>
            <input
              id="tripName"
              name="tripName"
              type="text"
              placeholder="e.g., Summer Vacation 2024"
              value={formData.tripName}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div className="create-trip-form-group">
            <label htmlFor="destination">Destination *</label>
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="e.g., Paris, France"
              value={formData.destination}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div className="create-trip-form-row">
            <div className="create-trip-form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                disabled={loading}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="create-trip-form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={loading}
                min={
                  formData.startDate || new Date().toISOString().split("T")[0]
                }
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="create-trip-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
