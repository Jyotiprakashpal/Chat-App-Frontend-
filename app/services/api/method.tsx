import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./baseurl";

// Helper function to get the auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
};

// Helper function to make fetch requests
const fetchWithAuth = async (
  endpoint: string,
  method: string,
  data?: any,
  params?: Record<string, string>
): Promise<any> => {
  try {
    // Build URL with query parameters if provided
    let url = `${BASE_URL}${endpoint}`;
    
    if (method === "GET" && params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    // Get the auth token
    const token = await getAuthToken();

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Build fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for non-GET requests
    if (data && method !== "GET") {
      fetchOptions.body = JSON.stringify(data);
    }

    // Make the request
    const response = await fetch(url, fetchOptions);

    // Parse the response
    const responseData = await response.json();

    // Check if response is successful
    if (!response.ok) {
      throw new Error(responseData.message || "Request failed");
    }

    return responseData;
  } catch (error: any) {
    console.log(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// API methods object
export const API = {
  /**
   * POST request - for creating resources
   * @param endpoint - API endpoint (e.g., '/auth/register')
   * @param data - Request body data
   * @returns Promise with response data
   */
  post: async (endpoint: string, data: any): Promise<any> => {
    return fetchWithAuth(endpoint, "POST", data);
  },

  /**
   * GET request - for retrieving resources
   * @param endpoint - API endpoint (e.g., '/user/profile')
   * @param params - Optional query parameters
   * @returns Promise with response data
   */
  get: async (endpoint: string, params?: Record<string, string>): Promise<any> => {
    return fetchWithAuth(endpoint, "GET", undefined, params);
  },

  /**
   * PUT request - for updating resources
   * @param endpoint - API endpoint (e.g., '/user/profile')
   * @param data - Request body data
   * @returns Promise with response data
   */
  put: async (endpoint: string, data: any): Promise<any> => {
    return fetchWithAuth(endpoint, "PUT", data);
  },
};

export default API;
