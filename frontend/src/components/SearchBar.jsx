import React, { useState, useEffect } from 'react';
import { Search, X, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SearchBar = ({
  initialQuery = '',
  onSearch,
  placeholder = 'Search movies by title, director, genre...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const { searchHistory, recordSearchQuery } = useAuth();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      recordSearchQuery(query.trim());
      onSearch(query.trim());
      setShowHistory(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleHistorySelect = (historyQuery) => {
    setQuery(historyQuery);
    recordSearchQuery(historyQuery);
    onSearch(historyQuery);
    setShowHistory(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-24 py-3.5 bg-[#141620] border border-gray-700/80 rounded-2xl text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-xl transition-all"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-red-600/30"
          >
            Search
          </button>
        </div>
      </form>

      {/* History Popup */}
      {showHistory && searchHistory.length > 0 && !query && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#181a26] border border-gray-800 rounded-2xl p-3 shadow-2xl z-30">
          <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-red-500" /> Recent Searches
            </span>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Close
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {searchHistory.slice(0, 8).map((item) => (
              <button
                key={item.id || item.query}
                type="button"
                onClick={() => handleHistorySelect(item.query)}
                className="px-3 py-1.5 bg-gray-900/80 hover:bg-red-950/60 hover:text-red-300 border border-gray-800 rounded-xl text-xs text-gray-300 transition-colors text-left"
              >
                {item.query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
