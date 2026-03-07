// Storage utility functions
// This file provides wrapper functions for AsyncStorage operations

import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to get the auth token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
};

// Helper function to get user data
export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.log("Error getting user data:", error);
    return null;
  }
};

// Helper function to save auth data
export const saveAuthData = async (token: string, user: any): Promise<void> => {
  try {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.log("Error saving auth data:", error);
    throw error;
  }
};

// Helper function to clear auth data
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.log("Error clearing auth data:", error);
    throw error;
  }
};

// Default export
export default {
  getAuthToken,
  getUserData,
  saveAuthData,
  clearAuthData,
};
