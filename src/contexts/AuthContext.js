import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // To make API requests
import { CircularProgress,Box } from "@mui/material";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // Loading state
  const [isLoggedOut,setIsLoggedOut] = useState(false)

  // Fetch user info from the API
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/user-info`, { withCredentials: true });

      if (response.data.success) {
        console.log("User Info", response.data);
        setUser(response.data.user); // Store user info in state
        setIsLoggedOut(false)
      } else {
        setUser(null); // Clear user info if not authenticated
        console.log("Is Logged Out")
        setIsLoggedOut(true)
      }
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      setUser(null); // Clear user info on error
        setIsLoggedOut(true)
        console.log("Is Logged Out")

    }
    setLoading(false); // Set loading false only after request completes
  };

  // Run fetchUserInfo when the component mounts
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Context value to provide
  const value = { user, setUser, loading,isLoggedOut,setIsLoggedOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
