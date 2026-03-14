import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useGetCurrentUser, useLogoutUser, User } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, refetch } = useGetCurrentUser({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  });

  const logoutMutation = useLogoutUser();

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/login");
      }
    });
  };

  const value = {
    user: user || null,
    isLoading,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    refetchUser: () => refetch(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
