"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const PatreonAuthContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export function PatreonAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("patreon_token");
    setToken(null);
    setUser(null);
  }, []);

  const fetchUserData = useCallback(
    async (authToken) => {
      try {
        const response = await fetch(`${API_BASE_URL}/patreon/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          // Token invalid, clear it
          logout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        logout();
      } finally {
        setLoading(false);
      }
    },
    [logout],
  );

  useEffect(() => {
    setIsClient(true);
    // Check if user is already logged in (only on client side)
    const storedToken = localStorage.getItem("patreon_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, [fetchUserData]);

  const login = async (returnUrl) => {
    try {
      let target = returnUrl;
      if (typeof window !== "undefined") {
        target = returnUrl || window.location.pathname + window.location.search;
        localStorage.setItem("patreon_return_url", target);
      }

      // Fetch the OAuth URL from backend with returnUrl
      const queryParams = new URLSearchParams({ intent: "login" });
      if (target) {
        queryParams.set("returnUrl", target);
      }

      const response = await fetch(
        `${API_BASE_URL}/patreon/auth?${queryParams.toString()}`,
      );
      const data = await response.json();

      if (data.data?.authUrl) {
        // Redirect to Patreon OAuth page
        window.location.href = data.data.authUrl;
      } else {
        console.error("Failed to get OAuth URL:", data);
        alert("Failed to initiate Patreon login. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating Patreon login:", error);
      alert("Failed to connect to authentication server.");
    }
  };

  const handleCallback = useCallback(
    (jwtToken) => {
      localStorage.setItem("patreon_token", jwtToken);
      setToken(jwtToken);
      fetchUserData(jwtToken);
    },
    [fetchUserData],
  );

  const checkDownloadEligibility = async (assetId) => {
    if (!token) return false;

    try {
      const response = await fetch(
        `${API_BASE_URL}/patreon/check-download/${assetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      return data.data?.canDownload || false;
    } catch (error) {
      console.error("Error checking download eligibility:", error);
      return false;
    }
  };

  const verifyPatronStatus = async () => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/patreon/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.data?.isActivePatron || false;
    } catch (error) {
      console.error("Error verifying patron status:", error);
      return false;
    }
  };

  return (
    <PatreonAuthContext.Provider
      value={{
        user,
        token,
        loading: isClient ? loading : true,
        isAuthenticated: isClient ? !!user : false,
        login,
        logout,
        handleCallback,
        checkDownloadEligibility,
        verifyPatronStatus,
      }}
    >
      {children}
    </PatreonAuthContext.Provider>
  );
}

export const usePatreonAuth = () => {
  const context = useContext(PatreonAuthContext);
  if (!context) {
    throw new Error("usePatreonAuth must be used within PatreonAuthProvider");
  }
  return context;
};
