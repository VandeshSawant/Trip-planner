import axiosInstance from "../api/axiosInstance";

// Fetch all trips for the logged-in user
export const fetchUserTrips = async () => {
  try {
    // Make GET request to backend
    const response = await axiosInstance.get("/users/my-trips");

    // Return the trips data
    return response.data;
  } catch (error) {
    // Log error and throw it so component can handle it
    console.error("Error fetching trips:", error.message);
    throw error;
  }
};

// We'll add more functions here later (createTrip, joinTrip, etc.)

// Create a new trip
export const createTrip = async (tripData) => {
  try {
    console.log("🔍 DEBUG: createTrip called with:", tripData);

    console.log("🔍 DEBUG: Sending request to /trips with data:", tripData);

    // Make POST request to backend
    const response = await axiosInstance.post("/trips", tripData);

    console.log("✅ DEBUG: Create trip response:", response.data);

    // Return the created trip data
    return response.data;
  } catch (error) {
    console.error("❌ DEBUG: Error in createTrip:", error);
    console.error("  - Message:", error.message);
    console.error("  - Status:", error.response?.status);
    console.error("  - Data:", error.response?.data);
    throw error;
  }
};
// Join a trip after creating it
export const joinTrip = async (tripId) => {
  try {
    const response = await axiosInstance.post(`/trips/${tripId}/join`);

    return response.data;
  } catch (error) {
    console.error("❌ DEBUG: Error in joinTrip:", error);
    console.error("  - Message:", error.message);
    console.error("  - Status:", error.response?.status);
    console.error("  - Data:", error.response?.data);
    throw error;
  }
};

// Leave a trip
export const leaveTrip = async (tripId) => {
  try {
    const response = await axiosInstance.delete(`/trips/${tripId}/leave`);

    return response.data;
  } catch (error) {
    console.error("❌ DEBUG: Error in leaveTrip:", error);
    console.error("  - Message:", error.message);
    console.error("  - Status:", error.response?.status);
    console.error("  - Data:", error.response?.data);
    throw error;
  }
};

// Fetch details of a specific trip including members and itinerary
export const fetchTripDetails = async (tripId) => {
  try {
    // Fetch user's trips to get basic trip information
    const tripsResponse = await axiosInstance.get("/users/my-trips");
    const trip = tripsResponse.data.find((t) => t.tripId == tripId);

    if (!trip) {
      throw new Error("Trip not found");
    }

    // Fetch trip members
    const membersResponse = await axiosInstance.get(`/trips/${tripId}/members`);

    // Fetch trip itinerary
    const itineraryResponse = await axiosInstance.get(
      `/trips/${tripId}/itinerary`,
    );

    // Combine all data
    return {
      ...trip,
      members: membersResponse.data,
      itinerary: itineraryResponse.data,
    };
  } catch (error) {
    console.error("Error fetching trip details:", error.message);
    throw error;
  }
};
