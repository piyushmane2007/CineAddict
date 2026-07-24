import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Bookmark, Info, Check } from 'lucide-react';
import { getImageUrl, getReleaseYear, formatRating } from '../utils/movieHelpers';
import { useAuth } from '../context/AuthContext';
import TrailerModal from './TrailerModal';

export const HeroBanner = ({ movie }) => {
  const { toggleWatchlist, isInWatchlist, recordViewedMovie } = useAuth();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  if (!movie) return null;

  const title = movie.title || movie.name || 'Featured Film';
  const backdropPath = movie.backdrop_path || movie.backdrop_url || movie.backdrop;
  const rating = movie.vote_average ?? movie.rating;
  const year = getReleaseYear(movie.release_date || movie.first_air_date || movie.year);
  const watchlisted = isInWatchlist(movie.id);

  return (
    <>
      <div className="relative w-full min-h-[70vh] lg:min-h-[75vh] flex items-end rounded-3xl overflow-hidden bg-gray-950 border border-gray-800/80 my-4 shadow-2xl">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={getImageUrl(backdropPath, 'backdrop')}
            alt={title}
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90"
          />
          {/* Multi-stage Dark Gradient Grids */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e12] via-[#0d0e12]/80 to-transparent max-w-3xl" />
        </div>

        {/* Content Section */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-gray-300">
            <span className="px-3 py-1 rounded-full bg-red-600/90 text-white uppercase tracking-wider text-[11px] font-bold shadow-md">
              Featured Movie
            </span>
            {rating !== undefined && rating !== null && (
              <span className="flex items-center gap-1 text-amber-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Star className="w-4 h-4 fill-amber-400" />
                {formatRating(rating)} / 10
              </span>
            )}
            {year && (
              <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-gray-300">
                {year}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {title}
          </h1>

          {movie.overview && (
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-2xl font-normal drop-shadow">
              {movie.overview}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => setIsTrailerOpen(true)}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-xl shadow-red-600/40 transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Trailer
            </button>

            <button
              type="button"
              onClick={() => toggleWatchlist(movie)}
              className={`px-5 py-3.5 font-semibold rounded-2xl backdrop-blur-md border transition-all duration-200 flex items-center gap-2 text-sm sm:text-base ${
                watchlisted
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {watchlisted ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" /> Watchlisted
                </>
              ) : (
                <>
                  <Bookmark className="w-5 h-5" /> Add to Watchlist
                </>
              )}
            </button>

            <Link
              to={`/movie/${movie.id}`}
              onClick={() => recordViewedMovie(movie)}
              className="px-5 py-3.5 bg-gray-900/80 hover:bg-gray-800 text-gray-200 hover:text-white font-semibold rounded-2xl border border-gray-700/80 backdrop-blur-md transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              <Info className="w-5 h-5 text-gray-400" /> Details
            </Link>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movieTitle={title}
        youtubeId={movie.youtube_id}
        trailerUrl={movie.trailer_url}
      />
    </>
  );
};

export default HeroBanner;
