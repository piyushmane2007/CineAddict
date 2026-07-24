import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCarousel from '../components/MovieCarousel';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';

export const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const [trending, popular, topRated, upcoming] = await Promise.allSettled([
          apiService.getTrending(),
          apiService.getPopular(),
          apiService.getTopRated(),
          apiService.getUpcoming(),
        ]);

        const trendingList = trending.status === 'fulfilled' ? trending.value : [];
        const popularList = popular.status === 'fulfilled' ? popular.value : [];
        const topRatedList = topRated.status === 'fulfilled' ? topRated.value : [];
        const upcomingList = upcoming.status === 'fulfilled' ? upcoming.value : [];

        setTrendingMovies(trendingList);
        setPopularMovies(popularList);
        setTopRatedMovies(topRatedList);
        setUpcomingMovies(upcomingList);

        if (trendingList.length > 0) {
          setFeaturedMovie(trendingList[0]);
        } else if (popularList.length > 0) {
          setFeaturedMovie(popularList[0]);
        }
      } catch (err) {
        console.error('Failed to load home movie data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading latest cinema catalogue..." />;
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Featured Hero Banner */}
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      {/* Carousels */}
      <MovieCarousel title="Trending Right Now" movies={trendingMovies} icon="trending" />

      <MovieCarousel title="Popular Releases" movies={popularMovies} icon="popular" />

      <MovieCarousel title="Top Rated Classics" movies={topRatedMovies} icon="top" />

      <MovieCarousel title="Upcoming Premieres" movies={upcomingMovies} icon="upcoming" />

      {/* Grid view of popular movies */}
      {popularMovies.length > 0 && (
        <MovieGrid
          title="Explore Popular Cinema"
          subtitle="All top rated releases available in your library"
          movies={popularMovies.slice(0, 12)}
        />
      )}
    </div>
  );
};

export default Home;
