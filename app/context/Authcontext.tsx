import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { ENDPOINTS } from "../services/api/endpoints";
import API from "../services/api/method";

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      
      if (token) {
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // If token exists but no user data, fetch from /me
          try {
            const currentUser = await API.get(ENDPOINTS.AUTH.GET_CURRENT_USER);
            await AsyncStorage.setItem("user", JSON.stringify(currentUser));
            setUser(currentUser);
          } catch (error) {
            // Clear token if /me fails
            await AsyncStorage.removeItem("token");
          }
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Make API call to login endpoint using API method
      const data = await API.post(ENDPOINTS.AUTH.LOGIN, { email, password });

      // Store the token
      await AsyncStorage.setItem("token", data.token);
      
      // Small delay to ensure token is persisted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get current user details using the /me endpoint
      const userData = await API.get(ENDPOINTS.AUTH.GET_CURRENT_USER);
      
      // Store the user
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
