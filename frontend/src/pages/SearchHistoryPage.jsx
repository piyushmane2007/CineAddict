import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SearchHistoryPage = () => {
  const { searchHistory, clearSearchHistory } = useAuth();
  const navigate = useNavigate();

  const handleQueryClick = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Search History</h1>
            <p className="text-xs sm:text-sm text-gray-400">Log of all your movie queries executed on CineAddict.</p>
          </div>
        </div>

        {searchHistory.length > 0 && (
          <button
            type="button"
            onClick={clearSearchHistory}
            className="px-3.5 py-2 bg-gray-900 hover:bg-red-950/60 text-gray-300 hover:text-red-400 border border-gray-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear Search Log
          </button>
        )}
      </div>

      {searchHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#131520] rounded-3xl border border-gray-800 text-center space-y-3">
          <Search className="w-12 h-12 text-gray-600 stroke-1" />
          <h3 className="text-base font-semibold text-gray-300">No search logs recorded</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Queries executed in the search bar will appear here for fast replay.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {searchHistory.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => handleQueryClick(item.query)}
              className="group bg-[#131520] hover:bg-[#181a28] border border-gray-800/80 hover:border-gray-700 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-gray-900 text-red-500 group-hover:scale-110 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-red-400 transition-colors">
                    &quot;{item.query}&quot;
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    {item.timestamp && (
                      <span>
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    {item.count && item.count > 1 && (
                      <span className="px-1.5 py-0.2 bg-gray-800 text-gray-300 rounded font-semibold">
                        {item.count} searches
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 group-hover:text-red-400 transition-colors">
                <span>Replay Search</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHistoryPage;
