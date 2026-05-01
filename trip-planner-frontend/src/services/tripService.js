import axios from "axios";

// Use /api which proxies to http://localhost:8080 (see vite.config.js)
const API_BASE_URL = "/api";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Fetch all trips for the logged-in user
export const fetchUserTrips = async () => {
  try {
    // Get userId from localStorage (set during login)
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User not logged in");
    }

    const url = `/users/${userId}/trips`;

    // Make GET request to backend
    const response = await apiClient.get(url);

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
    // Get userId from localStorage
    const userId = localStorage.getItem("userId");

    console.log("🔍 DEBUG: createTrip called with:", tripData);
    console.log("🔍 DEBUG: userId from localStorage:", userId);

    if (!userId) {
      throw new Error("User not logged in");
    }

    const requestData = {
      ...tripData,
      userId: parseInt(userId), // Add userId as number
    };

    console.log("🔍 DEBUG: Sending request to /trips with data:", requestData);

    // Make POST request to backend
    const response = await apiClient.post("/trips", requestData);

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
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User not logged in");
    }

    const response = await apiClient.post(`/trips/${tripId}/join`, {
      userId: parseInt(userId),
    });

    return response.data;
  } catch (error) {
    console.error("❌ DEBUG: Error in joinTrip:", error);
    console.error("  - Message:", error.message);
    console.error("  - Status:", error.response?.status);
    console.error("  - Data:", error.response?.data);
    throw error;
  }
};

// Fetch details of a specific trip including members and itinerary
export const fetchTripDetails = async (tripId) => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User not logged in");
    }

    // Fetch user's trips to get basic trip information
    const tripsResponse = await apiClient.get(`/users/${userId}/trips`);
    const trip = tripsResponse.data.find(t => t.tripId == tripId);

    if (!trip) {
      throw new Error("Trip not found");
    }

    // Fetch trip members
    const membersResponse = await apiClient.get(`/trips/${tripId}/members`);

    // Fetch trip itinerary
    const itineraryResponse = await apiClient.get(`/trips/${tripId}/itinerary`);

    // Combine all data
    return {
      ...trip,
      members: membersResponse.data,
      itinerary: itineraryResponse.data
    };
  } catch (error) {
    console.error("Error fetching trip details:", error.message);
    throw error;
  }
};
