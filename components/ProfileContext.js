"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("styleAIProfile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      setProfile(null);
    }
  }, []);

  const saveProfile = (newProfile) => {
    localStorage.setItem("styleAIProfile", JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
