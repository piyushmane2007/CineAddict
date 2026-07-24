import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Heart,
  Bookmark,
  Play,
  Film,
  Send,
  User,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { apiService } from '../services/api';
import { getImageUrl, getReleaseYear, formatRuntime, formatRating } from '../utils/movieHelpers';
import { useAuth } from '../context/AuthContext';
import CastCard from '../components/CastCard';
import ReviewCard from '../components/ReviewCard';
import MovieCarousel from '../components/MovieCarousel';
import TrailerModal from '../components/TrailerModal';
import LoadingSpinner from '../components/LoadingSpinner';

export const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // New review form
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(8);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const {
    toggleFavorite,
    isFavorite,
    toggleWatchlist,
    isInWatchlist,
    recordViewedMovie,
    isAuthenticated,
    user,
  } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const details = await apiService.getMovieDetails(id);
        setMovie(details);
        if (details) recordViewedMovie(details);

        const [revs, similar] = await Promise.allSettled([
          apiService.getMovieReviews(id),
          apiService.getSimilarMovies(id),
        ]);

        if (revs.status === 'fulfilled') setReviews(revs.value);
        if (similar.status === 'fulfilled') setSimilarMovies(similar.value);
      } catch (err) {
        console.error('Error loading movie details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim() || !id) return;

    setIsSubmittingReview(true);
    try {
      const added = await apiService.addReview(id, {
        rating: Number(newRating),
        content: newReviewText.trim(),
        author: user?.username || 'You',
      });

      if (added) {
        setReviews((prev) => [added, ...prev]);
        setNewReviewText('');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Fetching movie details..." />;
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <Film className="w-16 h-16 text-gray-600" />
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-gray-400 text-sm">We could not retrieve the details for this movie ID.</p>
        <Link
          to="/"
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-500 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const title = movie.title || movie.name || 'Untitled';
  const backdropPath = movie.backdrop_path || movie.backdrop_url || movie.backdrop;
  const posterPath = movie.poster_path || movie.poster_url || movie.poster;
  const rating = movie.vote_average ?? movie.rating;
  const releaseDate = movie.release_date || movie.first_air_date || movie.year;
  const year = getReleaseYear(releaseDate);
  const runtime = formatRuntime(movie.runtime);
  const favorited = isFavorite(movie.id);
  const watchlisted = isInWatchlist(movie.id);
  const genres = movie.genres || [];
  const castList = movie.cast || [];

  return (
    <div className="space-y-10 pb-12 pt-4">
      <Link
        to={-1}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Main Details Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#12141e] border border-gray-800 shadow-2xl">
        {/* Backdrop background */}
        <div className="absolute inset-0 z-0">
          <img
            src={getImageUrl(backdropPath, 'backdrop')}
            alt={title}
            className="w-full h-full object-cover filter brightness-40 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141e] via-[#12141e]/90 to-transparent" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Poster Card */}
          <div className="w-48 sm:w-64 lg:w-72 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/80 bg-gray-900">
            <img
              src={getImageUrl(posterPath, 'poster')}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Column */}
          <div className="flex-grow space-y-5 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm font-semibold">
              {rating !== undefined && rating !== null && (
                <span className="flex items-center gap-1.5 text-amber-400 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {formatRating(rating)} / 10
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1 text-gray-300 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-red-500" /> {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1 text-gray-300 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> {runtime}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold border border-gray-700/60"
                  >
                    {typeof g === 'string' ? g : g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-red-400 italic font-medium text-sm sm:text-base">&quot;{movie.tagline}&quot;</p>
            )}

            {/* Overview */}
            {movie.overview && (
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
            )}

            {/* Interactive Action Controls */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-3">
              <button
                type="button"
                onClick={() => setIsTrailerOpen(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 text-sm"
              >
                <Play className="w-4 h-4 fill-current" /> Watch Trailer
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(movie)}
                className={`px-4 py-3 font-semibold rounded-xl border transition-all flex items-center gap-2 text-sm ${
                  favorited
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                    : 'bg-gray-800/80 hover:bg-gray-700 text-gray-200 border-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                {favorited ? 'Favorited' : 'Add to Favorites'}
              </button>

              <button
                type="button"
                onClick={() => toggleWatchlist(movie)}
                className={`px-4 py-3 font-semibold rounded-xl border transition-all flex items-center gap-2 text-sm ${
                  watchlisted
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                    : 'bg-gray-800/80 hover:bg-gray-700 text-gray-200 border-gray-700'
                }`}
              >
                {watchlisted ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" /> Watchlisted
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Watchlist
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {castList.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Top Cast</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {castList.map((actor, idx) => (
              <CastCard key={actor.id ? `${actor.id}-${idx}` : idx} cast={actor} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            User Reviews ({reviews.length})
          </h2>
        </div>

        {/* Add Review Box */}
        <form
          onSubmit={handleAddReview}
          className="bg-[#141622] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl"
        >
          <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <User className="w-4 h-4 text-red-500" /> Write a Review
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-400">Rating (1 to 10):</label>
              <input
                type="number"
                min={1}
                max={10}
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-20 px-3 py-1 bg-[#0d0e12] border border-gray-700 rounded-lg text-white font-bold text-sm"
              />
            </div>

            <textarea
              required
              rows={3}
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder={
                isAuthenticated
                  ? 'Share your thoughts on this movie...'
                  : 'Write your thoughts here (Sign in to sync with your user profile)...'
              }
              className="w-full p-3.5 bg-[#0d0e12] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingReview || !newReviewText.trim()}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Submit Review
            </button>
          </div>
        </form>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">No reviews submitted yet. Be the first to share a review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev, idx) => (
              <ReviewCard key={rev.id || idx} review={rev} />
            ))}
          </div>
        )}
      </section>

      {/* Similar Movies Carousel */}
      {similarMovies.length > 0 && (
        <MovieCarousel title="You Might Also Like" movies={similarMovies} icon="popular" />
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movieTitle={title}
        youtubeId={movie.youtube_id}
        trailerUrl={movie.trailer_url}
      />
    </div>
  );
};

export default MovieDetails;
