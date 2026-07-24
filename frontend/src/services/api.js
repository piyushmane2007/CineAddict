import axios from 'axios';

// Default backend URL as requested by user
export const DEFAULT_BACKEND_URL = 'http://127.0.0.1:5000';

export const getBackendUrl = () => {
  return localStorage.getItem('cineaddict_backend_url') || DEFAULT_BACKEND_URL;
};

export const setBackendUrl = (url) => {
  if (url) {
    localStorage.setItem('cineaddict_backend_url', url.trim());
    apiClient.defaults.baseURL = url.trim();
  }
};

// Create primary Axios client instance
const apiClient = axios.create({
  baseURL: getBackendUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cineaddict_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Update baseURL in case user changed it dynamically
    config.baseURL = getBackendUrl();
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to send requests with endpoint fallback support
const requestWithFallback = async (method, primaryUrl, fallbackUrl, dataOrParams = null, isParams = false) => {
  try {
    const config = isParams ? { params: dataOrParams } : {};
    if (method.toLowerCase() === 'get') {
      const res = await apiClient.get(primaryUrl, config);
      return res.data;
    } else if (method.toLowerCase() === 'post') {
      const res = await apiClient.post(primaryUrl, dataOrParams);
      return res.data;
    } else if (method.toLowerCase() === 'delete') {
      const res = await apiClient.delete(primaryUrl, config);
      return res.data;
    }
  } catch (err) {
    if (fallbackUrl && (err.response?.status === 404 || !err.response)) {
      try {
        const config = isParams ? { params: dataOrParams } : {};
        if (method.toLowerCase() === 'get') {
          const res = await apiClient.get(fallbackUrl, config);
          return res.data;
        } else if (method.toLowerCase() === 'post') {
          const res = await apiClient.post(fallbackUrl, dataOrParams);
          return res.data;
        } else if (method.toLowerCase() === 'delete') {
          const res = await apiClient.delete(fallbackUrl, config);
          return res.data;
        }
      } catch (fallbackErr) {
        throw fallbackErr;
      }
    }
    throw err;
  }
};

// Helper to extract array of items from various Flask API response structures
export const extractMovieList = (responseData) => {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData.movies)) return responseData.movies;
  if (Array.isArray(responseData.results)) return responseData.results;
  if (Array.isArray(responseData.data)) return responseData.data;
  if (Array.isArray(responseData.recommendations)) return responseData.recommendations;
  if (Array.isArray(responseData.items)) return responseData.items;
  return [];
};

// ==========================================
// API SERVICES FOR CINEADDICT FLASK BACKEND
// ==========================================

export const apiService = {
  // Check backend server health/connection
  checkHealth: async () => {
    try {
      return await requestWithFallback('get', '/api/health', '/health');
    } catch (err) {
      // Attempt root Ping if health endpoint is not defined
      try {
        return await apiClient.get('/');
      } catch (pingErr) {
        throw err;
      }
    }
  },

  // --- 1 & 2. Authentication ---
  login: async (email, password) => {
    const payload = { email, password };
    return await requestWithFallback('post', '/api/auth/login', '/login', payload);
  },

  register: async (username, email, password) => {
    const payload = { username, email, password };
    return await requestWithFallback('post', '/api/auth/register', '/register', payload);
  },

  getProfile: async () => {
    return await requestWithFallback('get', '/api/auth/me', '/profile');
  },

  // --- 3. Home Movies Categories ---
  getTrendingMovies: async () => {
    const data = await requestWithFallback('get', '/api/movies/trending', '/movies/trending');
    return extractMovieList(data);
  },

  getPopularMovies: async () => {
    const data = await requestWithFallback('get', '/api/movies/popular', '/movies/popular');
    return extractMovieList(data);
  },

  getTopRatedMovies: async () => {
    const data = await requestWithFallback('get', '/api/movies/top-rated', '/movies/top_rated');
    return extractMovieList(data);
  },

  getUpcomingMovies: async () => {
    const data = await requestWithFallback('get', '/api/movies/upcoming', '/movies/upcoming');
    return extractMovieList(data);
  },

  getNowPlayingMovies: async () => {
    const data = await requestWithFallback('get', '/api/movies/now-playing', '/movies/now_playing');
    return extractMovieList(data);
  },

  // --- 4. Search Movies ---
  searchMovies: async (query) => {
    if (!query) return [];
    const data = await requestWithFallback(
      'get',
      `/api/movies/search?q=${encodeURIComponent(query)}`,
      `/search?query=${encodeURIComponent(query)}`
    );
    return extractMovieList(data);
  },

  // --- 5. Movie Details & Sub-resources ---
  getMovieDetails: async (movieId) => {
    const data = await requestWithFallback('get', `/api/movies/${movieId}`, `/movies/${movieId}`);
    return data.movie || data.data || data;
  },

  getMovieCast: async (movieId) => {
    try {
      const data = await requestWithFallback('get', `/api/movies/${movieId}/credits`, `/movies/${movieId}/cast`);
      return data.cast || data.credits || extractMovieList(data);
    } catch (err) {
      return [];
    }
  },

  getMovieReviews: async (movieId) => {
    try {
      const data = await requestWithFallback('get', `/api/movies/${movieId}/reviews`, `/movies/${movieId}/reviews`);
      return data.reviews || extractMovieList(data);
    } catch (err) {
      return [];
    }
  },

  addMovieReview: async (movieId, content, rating) => {
    return await requestWithFallback(
      'post',
      `/api/movies/${movieId}/reviews`,
      `/movies/${movieId}/reviews`,
      { content, rating }
    );
  },

  getSimilarMovies: async (movieId) => {
    try {
      const data = await requestWithFallback('get', `/api/movies/${movieId}/similar`, `/movies/${movieId}/similar`);
      return extractMovieList(data);
    } catch (err) {
      return [];
    }
  },

  getRecommendedMovies: async (movieId) => {
    try {
      const data = await requestWithFallback('get', `/api/movies/${movieId}/recommendations`, `/movies/${movieId}/recommendations`);
      return extractMovieList(data);
    } catch (err) {
      return [];
    }
  },

  // --- 6. AI Recommendations ---
  getAiRecommendations: async (promptText) => {
    const payload = { prompt: promptText, query: promptText, text: promptText };
    const data = await requestWithFallback('post', '/api/ai/recommend', '/recommendations', payload);
    return extractMovieList(data);
  },

  // --- 7. Favorites ---
  getFavorites: async () => {
    try {
      const data = await requestWithFallback('get', '/api/favorites', '/favorites');
      return extractMovieList(data);
    } catch (err) {
      return [];
    }
  },

  addFavorite: async (movie) => {
    const payload = typeof movie === 'object' ? { movie_id: movie.id, ...movie } : { movie_id: movie };
    return await requestWithFallback('post', '/api/favorites', '/favorites', payload);
  },

  removeFavorite: async (movieId) => {
    return await requestWithFallback('delete', `/api/favorites/${movieId}`, `/favorites/${movieId}`);
  },

  // --- 8. Watchlist ---
  getWatchlist: async () => {
    try {
      const data = await requestWithFallback('get', '/api/watchlist', '/watchlist');
      return extractMovieList(data);
    } catch (err) {
      return [];
    }
  },

  addToWatchlist: async (movie) => {
    const payload = typeof movie === 'object' ? { movie_id: movie.id, ...movie } : { movie_id: movie };
    return await requestWithFallback('post', '/api/watchlist', '/watchlist', payload);
  },

  removeFromWatchlist: async (movieId) => {
    return await requestWithFallback('delete', `/api/watchlist/${movieId}`, `/watchlist/${movieId}`);
  },

  // --- 9. Recently Viewed ---
  getRecentlyViewed: async () => {
    try {
      const data = await requestWithFallback('get', '/api/history/recent', '/recently-viewed');
      return extractMovieList(data);
    } catch (err) {
      return [];
    }
  },

  addRecentlyViewed: async (movie) => {
    try {
      const payload = typeof movie === 'object' ? { movie_id: movie.id, ...movie } : { movie_id: movie };
      return await requestWithFallback('post', '/api/history/recent', '/recently-viewed', payload);
    } catch (err) {
      // Ignore background tracking failure if offline
    }
  },

  clearRecentlyViewed: async () => {
    return await requestWithFallback('delete', '/api/history/recent', '/recently-viewed/clear');
  },

  // --- 10. Search History ---
  getSearchHistory: async () => {
    try {
      const data = await requestWithFallback('get', '/api/history/search', '/search-history');
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.history)) return data.history;
      if (Array.isArray(data.queries)) return data.queries;
      return [];
    } catch (err) {
      return [];
    }
  },

  addSearchHistory: async (query) => {
    try {
      return await requestWithFallback('post', '/api/history/search', '/search-history', { query });
    } catch (err) {
      // Ignore background search history error
    }
  },

  clearSearchHistory: async () => {
    return await requestWithFallback('delete', '/api/history/search', '/search-history/clear');
  },
};

export default apiClient;
