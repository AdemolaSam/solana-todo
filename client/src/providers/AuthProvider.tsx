"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface IUser {
  walletAddress: string;
  _id: string;
  username: string | null;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const wallet = useWallet();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/user`, {
        headers: { Authoriation: `Bearer ${token}` },
      });
      setUser(data);
    } catch (error) {
      alert("Error fetching user");
    }
  };

  const getMessage = async (walletAddress: string) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/challenge?walletAddress=${walletAddress}`
      );
      return data.message;
    } catch (error) {
      alert("Error getting message");
    }
  };

  const verifySignedMessage = async (
    walletAddress: string,
    message: string,
    signature: string
  ) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify`, {
        walletAddress,
        message,
        signature,
      });
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (error) {
      alert("Error signing message");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token")!;
    const walletAddress = localStorage.getItem("walletAddress");
    setToken(token);
    if (token) {
      fetchUser();
    }
  }, []);

  const login = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.signMessage) {
      alert("Connect your wallet to proceed");
      return;
    }

    const walletAddress = wallet.publicKey.toString();

    // Message from the backend
    const messageRaw = await getMessage(walletAddress);

    // message in bytes
    const message = new TextEncoder().encode(messageRaw);
    // signed message
    const signature = await wallet.signMessage(message);

    // encoded signature
    const encodedSignature = bs58.encode(signature);

    const data = await verifySignedMessage(
      walletAddress,
      messageRaw,
      encodedSignature
    );

    localStorage.setItem("token", data?.token);
    localStorage.setItem("walletAddress", walletAddress);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
