import React from 'react';
import { User, Film, Heart, Bookmark, Clock, History, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, favorites, watchlist, recentlyViewed, searchHistory, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Profile Header */}
      <div className="bg-[#141622] border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-red-600/30">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.username || 'CineAddict User'}</h1>
            <p className="text-sm text-gray-400">{user?.email || 'Logged in user'}</p>
            <p className="text-xs text-gray-500 mt-1">CineAddict Member</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-900 hover:bg-red-950/80 text-gray-300 hover:text-red-400 border border-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/favorites"
          className="bg-[#141622] hover:bg-[#181a28] border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 transition-colors"
        >
          <Heart className="w-7 h-7 text-red-500 fill-current" />
          <span className="text-2xl font-black text-white">{favorites.length}</span>
          <span className="text-xs font-semibold text-gray-400">Favorites</span>
        </Link>

        <Link
          to="/watchlist"
          className="bg-[#141622] hover:bg-[#181a28] border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 transition-colors"
        >
          <Bookmark className="w-7 h-7 text-amber-500 fill-current" />
          <span className="text-2xl font-black text-white">{watchlist.length}</span>
          <span className="text-xs font-semibold text-gray-400">Watchlist</span>
        </Link>

        <Link
          to="/recently-viewed"
          className="bg-[#141622] hover:bg-[#181a28] border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 transition-colors"
        >
          <Clock className="w-7 h-7 text-blue-400" />
          <span className="text-2xl font-black text-white">{recentlyViewed.length}</span>
          <span className="text-xs font-semibold text-gray-400">Recently Viewed</span>
        </Link>

        <Link
          to="/search-history"
          className="bg-[#141622] hover:bg-[#181a28] border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 transition-colors"
        >
          <History className="w-7 h-7 text-purple-400" />
          <span className="text-2xl font-black text-white">{searchHistory.length}</span>
          <span className="text-xs font-semibold text-gray-400">Searches</span>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
