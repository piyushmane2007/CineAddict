import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, getBackendUrl, setBackendUrl } from "../services/api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("cineaddict_token"),
  );
  const [backendUrl, setBackendUrlState] = useState(getBackendUrl());
  const [isBackendConnected, setIsBackendConnected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // App features local + backend synced states
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("cineaddict_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem("cineaddict_watchlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem("cineaddict_recently_viewed");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("cineaddict_search_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync state to local storage for fast client UI persistence
  useEffect(() => {
    localStorage.setItem("cineaddict_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("cineaddict_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(
      "cineaddict_recently_viewed",
      JSON.stringify(recentlyViewed),
    );
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem(
      "cineaddict_search_history",
      JSON.stringify(searchHistory),
    );
  }, [searchHistory]);

  // Ping backend to check connection
  const checkBackendConnection = async () => {
    try {
      await apiService.checkHealth();
      setIsBackendConnected(true);
      return true;
    } catch {
      setIsBackendConnected(false);
      return false;
    }
  };

  const updateBackendUrl = async (newUrl) => {
    setBackendUrl(newUrl);
    setBackendUrlState(newUrl);
    return await checkBackendConnection();
  };

  // Sync user data with backend
  const refreshUserData = async () => {
    if (!token) return;
    try {
      const profile = await apiService.getProfile();
      if (profile) setUser(profile.user || profile);

      // Fetch user specific collections from Flask backend
      const [favs, wl, rv, sh] = await Promise.allSettled([
        apiService.getFavorites(),
        apiService.getWatchlist(),
        apiService.getRecentlyViewed(),
        apiService.getSearchHistory(),
      ]);

      if (
        favs.status === "fulfilled" &&
        Array.isArray(favs.value) &&
        favs.value.length > 0
      ) {
        setFavorites(favs.value);
      }
      if (
        wl.status === "fulfilled" &&
        Array.isArray(wl.value) &&
        wl.value.length > 0
      ) {
        setWatchlist(wl.value);
      }
      if (
        rv.status === "fulfilled" &&
        Array.isArray(rv.value) &&
        rv.value.length > 0
      ) {
        setRecentlyViewed(rv.value);
      }
      if (
        sh.status === "fulfilled" &&
        Array.isArray(sh.value) &&
        sh.value.length > 0
      ) {
        setSearchHistory(sh.value);
      }
    } catch (err) {
      console.warn("Could not refresh backend user profile:", err);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      await checkBackendConnection();

      const storedToken = localStorage.getItem("cineaddict_token");
      if (storedToken) {
        setToken(storedToken);
        const storedUser = localStorage.getItem("cineaddict_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        }
        await refreshUserData();
      }
      setIsLoading(false);
    };

    initApp();
  }, []);

  const login = async (email, pass) => {
    const response = await apiService.login(email, pass);
    const authToken = response.token || response.access_token || response.jwt;
    const userData = response.user || {
      email,
      username: email.split("@")[0],
      id: Date.now(),
    };

    if (authToken) {
      localStorage.setItem("cineaddict_token", authToken);
      setToken(authToken);
    }
    localStorage.setItem("cineaddict_user", JSON.stringify(userData));
    setUser(userData);
    await refreshUserData();
  };

  const register = async (username, email, pass) => {
    const response = await apiService.register(username, email, pass);
    const authToken = response.token || response.access_token;
    const userData = response.user || { username, email, id: Date.now() };

    if (authToken) {
      localStorage.setItem("cineaddict_token", authToken);
      setToken(authToken);
    }
    localStorage.setItem("cineaddict_user", JSON.stringify(userData));
    setUser(userData);
    await refreshUserData();
  };

  const logout = () => {
    localStorage.removeItem("cineaddict_token");
    localStorage.removeItem("cineaddict_user");
    setToken(null);
    setUser(null);
  };

  const isFavorite = (movieId) => {
    return favorites.some((m) => String(m.id) === String(movieId));
  };

  const toggleFavorite = async (movie) => {
    const exists = isFavorite(movie.id);
    if (exists) {
      setFavorites((prev) =>
        prev.filter((m) => String(m.id) !== String(movie.id)),
      );
      try {
        await apiService.removeFavorite(movie.id);
      } catch (e) {
        console.warn("Backend favorite remove fallback:", e);
      }
    } else {
      setFavorites((prev) => [
        movie,
        ...prev.filter((m) => String(m.id) !== String(movie.id)),
      ]);
      try {
        await apiService.addFavorite(movie);
      } catch (e) {
        console.warn("Backend favorite add fallback:", e);
      }
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => String(m.id) === String(movieId));
  };

  const toggleWatchlist = async (movie) => {
    const exists = isInWatchlist(movie.id);
    if (exists) {
      setWatchlist((prev) =>
        prev.filter((m) => String(m.id) !== String(movie.id)),
      );
      try {
        await apiService.removeFromWatchlist(movie.id);
      } catch (e) {
        console.warn("Backend watchlist remove fallback:", e);
      }
    } else {
      setWatchlist((prev) => [
        movie,
        ...prev.filter((m) => String(m.id) !== String(movie.id)),
      ]);
      try {
        await apiService.addToWatchlist(movie);
      } catch (e) {
        console.warn("Backend watchlist add fallback:", e);
      }
    }
  };

  const recordViewedMovie = (movie) => {
    if (!movie || !movie.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((m) => String(m.id) !== String(movie.id));
      return [movie, ...filtered].slice(0, 30);
    });
    apiService.addRecentlyViewed(movie);
  };

  const recordSearchQuery = (query) => {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();
    setSearchHistory((prev) => {
      const existing = prev.find(
        (item) => item.query.toLowerCase() === cleanQuery.toLowerCase(),
      );
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== cleanQuery.toLowerCase(),
      );
      const newCount = existing ? (existing.count || 1) + 1 : 1;
      const newItem = {
        id: Date.now(),
        query: cleanQuery,
        timestamp: new Date().toISOString(),
        count: newCount,
      };
      return [newItem, ...filtered].slice(0, 50);
    });
    apiService.addSearchHistory(cleanQuery);
  };

  const clearSearchHistory = async () => {
    setSearchHistory([]);
    try {
      await apiService.clearSearchHistory();
    } catch (e) {
      console.warn("Backend search history clear fallback:", e);
    }
  };

  const clearRecentlyViewed = async () => {
    setRecentlyViewed([]);
    try {
      await apiService.clearRecentlyViewed();
    } catch (e) {
      console.warn("Backend recently viewed clear fallback:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token || !!user,
        isLoading,
        backendUrl,
        isBackendConnected,
        favorites,
        watchlist,
        recentlyViewed,
        searchHistory,
        login,
        register,
        logout,
        updateBackendUrl,
        checkBackendConnection,
        toggleFavorite,
        isFavorite,
        toggleWatchlist,
        isInWatchlist,
        recordViewedMovie,
        recordSearchQuery,
        clearSearchHistory,
        clearRecentlyViewed,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
