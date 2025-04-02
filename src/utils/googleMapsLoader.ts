import { Loader } from '@googlemaps/js-api-loader';

// Set a consistent API key
// This is a placeholder - replace with your actual valid key from Google Cloud Console
const GOOGLE_MAPS_API_KEY = "AIzaSyC96ysHV1klqPW9dqZLtDWEEwM0jtgq4R8";

// Create a single loader instance to be shared across components
export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places", "marker"],
  // Add region and language for better defaults
  language: "en",
  region: "za"  // South Africa based on location names in your code
});

// Export the API key for reference
export const MAPS_API_KEY = GOOGLE_MAPS_API_KEY; 