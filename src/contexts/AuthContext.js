import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Fetch user info from the API
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/user-info`, { withCredentials: true });

      if (response.data.success) {
        console.log("User Info", response.data);
        setUser(response.data.user);
        setIsLoggedOut(false);
      } else {
        setUser(null);
        console.log("Error while fetching user auth");
        setIsLoggedOut(true);
      }
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      setUser(null);
      setIsLoggedOut(true);
    } finally {
      setLoading(false);
    }
  };

  // Run fetchUserInfo when the component mounts
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Context value to provide
  const value = { user, setUser, loading, isLoggedOut, setIsLoggedOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};