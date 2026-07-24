import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0b0c0f] border-t border-gray-800/80 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 font-black text-2xl text-white">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Film className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="bg-gradient-to-r from-white via-gray-200 to-red-500 bg-clip-text text-transparent">
                Cine<span className="text-red-600">Addict</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-500">
              Your ultimate cinematic portal. Explore trending releases, personalized AI recommendations, cast lists, and custom watchlists powered by Flask REST APIs.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">Trending Movies</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-red-400 transition-colors">Search Library</Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-red-400 transition-colors">AI Recommender</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Library */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">My Library</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/favorites" className="hover:text-red-400 transition-colors">Favorites</Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-red-400 transition-colors">Watchlist</Link>
              </li>
              <li>
                <Link to="/recently-viewed" className="hover:text-red-400 transition-colors">Recently Viewed</Link>
              </li>
              <li>
                <Link to="/search-history" className="hover:text-red-400 transition-colors">Search History</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Backend Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Integration</h4>
            <div className="p-3 bg-[#13151f] rounded-xl border border-gray-800 space-y-1.5 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
                <Shield className="w-3.5 h-3.5 text-red-500" /> Flask REST API
              </div>
              <p className="text-[11px] text-gray-500">
                Connected to local Flask server at <code className="text-red-400">http://127.0.0.1:5000</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} CineAddict. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            <span>for movie lovers worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
