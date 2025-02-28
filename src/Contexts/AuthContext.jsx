import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import useGeoLocation from "../Hooks/useGeoLocation";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { location, loading, error } = useGeoLocation();

  const login = async (name, email) => {
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/login",
        { name, email },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser({ name, email });
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, location, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
