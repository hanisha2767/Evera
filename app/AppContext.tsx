import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type EmissionItem = {
  id?: number;
  type: string;
  value: number;
  date: string;
};

type User = {
  id: number;
  name: string;
  email: string;
} | null;

type AppState = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  
  totalEmission: number;
  totalOffset: number;
  netEmission: number;
  greenScore: number;
  
  history: EmissionItem[];

  fetchUserData: () => Promise<void>;
  recordEmission: (mode: string, weight: number, distance: number) => Promise<void>;
  deleteEmission: (id: number) => Promise<void>;
  addOffset: (value: number) => Promise<number | undefined>;
  undoOffset: (id: number) => Promise<void>;
  
  resetAll: () => void;
};

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>(null);
  const [totalEmission, setTotalEmission] = useState(0);
  const [totalOffset, setTotalOffset] = useState(0);
  const [history, setHistory] = useState<EmissionItem[]>([]);

  const netEmission = Math.max(totalEmission - totalOffset, 0);
  const greenScore = Math.max(100 - (netEmission / (totalEmission || 1)) * 100, 0);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/${user.id}/data`, {
        headers: { "Bypass-Tunnel-Reminder": "true" }
      });
      const data = await response.json();
      if (response.ok) {
        setTotalEmission(data.totalEmission);
        setTotalOffset(data.totalOffset);
        setHistory(data.history);
      }
    } catch (e) {
      console.log("Error fetching user data:", e);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await SecureStore.getItemAsync("user");
        if (stored) {
          const u = JSON.parse(stored);
          setUser(u);
        }
      } catch (e) {
        console.log("Error loading user from secure store", e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const recordEmission = async (mode: string, weight: number, distance: number) => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/${user.id}/emission`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({ mode, weight, distance }),
      });
      if (response.ok) {
        fetchUserData();
      }
    } catch (e) {
      console.log("Error adding emission:", e);
    }
  };

  const deleteEmission = async (id: number) => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/${user.id}/emission/${id}`, {
        method: "DELETE",
        headers: { "Bypass-Tunnel-Reminder": "true" }
      });
      if (response.ok) {
        fetchUserData();
      }
    } catch (e) {
      console.log("Error deleting emission:", e);
    }
  };

  const addOffset = async (value: number) => {
    if (!user) return undefined;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/${user.id}/offset`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({ value }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchUserData();
        return data.offset.id;
      }
    } catch (e) {
      console.log("Error adding offset:", e);
    }
    return undefined;
  };

  const undoOffset = async (id: number) => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/${user.id}/offset/${id}`, {
        method: "DELETE",
        headers: { "Bypass-Tunnel-Reminder": "true" }
      });
      if (response.ok) {
        fetchUserData();
      }
    } catch (e) {
      console.log("Error undoing offset:", e);
    }
  };

  const resetAll = () => {
    console.log("Reset all not fully implemented for backend. Please delete items manually.");
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        totalEmission, totalOffset, netEmission, greenScore,
        history,
        fetchUserData,
        recordEmission,
        deleteEmission,
        addOffset,
        undoOffset,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("Wrap app with AppProvider");
  return ctx;
};