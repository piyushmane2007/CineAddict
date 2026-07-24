import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Film,
  Search,
  Sparkles,
  Heart,
  Bookmark,
  Clock,
  History,
  User,
  LogIn,
  Menu,
  X,
  Server,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout,
    isBackendConnected,
    favorites,
    watchlist,
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home", icon: Film },
    { path: "/search", label: "Search", icon: Search },
    {
      path: "/recommendations",
      label: "AI Recommendations",
      icon: Sparkles,
      badge: "AI",
    },
    {
      path: "/favorites",
      label: "Favorites",
      icon: Heart,
      count: favorites.length,
    },
    {
      path: "/watchlist",
      label: "Watchlist",
      icon: Bookmark,
      count: watchlist.length,
    },
    { path: "/recently-viewed", label: "Recently Viewed", icon: Clock },
    { path: "/search-history", label: "Search History", icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group font-black text-xl sm:text-2xl tracking-wider text-white"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <span className="bg-gradient-to-r from-white via-gray-200 to-red-500 bg-clip-text text-transparent">
            Cine<span className="text-red-600">Addict</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-red-600/15 text-red-400 border border-red-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-gradient-to-r from-red-600 to-amber-500 text-[10px] font-extrabold text-white rounded-full uppercase tracking-widest shadow-sm">
                    {link.badge}
                  </span>
                )}
                {link.count !== undefined && link.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-800 text-[10px] font-bold text-gray-300 rounded-full">
                    {link.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Backend Status Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400"
            title={`Flask Backend: ${isBackendConnected ? "Online" : "Offline"}`}
          >
            <Server className="w-3.5 h-3.5 text-gray-500" />
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500"
                  : "bg-amber-500"
              }`}
            />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-sm font-medium text-gray-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[100px] truncate">
                  {user?.username || "Profile"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#12141e] border-b border-gray-800 px-4 py-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-red-600/20 text-red-400 font-bold"
                        : "text-gray-300 hover:bg-white/5"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="px-2 py-0.5 bg-gray-800 text-xs font-bold text-gray-300 rounded-full">
                      {link.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-200"
                >
                  <User className="w-5 h-5 text-red-500" />
                  <span>{user?.username || "My Profile"}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-red-900/50 text-red-300 text-xs rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-center rounded-xl transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
