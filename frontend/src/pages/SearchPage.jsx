import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const movies = await apiService.searchMovies(query);
      setResults(movies);
    } catch (err) {
      console.error('Error during movie search:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (newQuery) => {
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
      setResults([]);
      setHasSearched(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Search Movies</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Find movies by keyword, title, actor, or genre from your Flask API backend.
        </p>

        <div className="pt-2">
          <SearchBar initialQuery={queryParam} onSearch={handleSearchSubmit} autoFocus />
        </div>
      </div>

      {hasSearched && (
        <MovieGrid
          title={queryParam ? `Search results for "${queryParam}"` : 'Search Results'}
          subtitle={`${results.length} movies match your query`}
          movies={results}
          isLoading={isLoading}
          emptyMessage={`No movies matched "${queryParam}".`}
        />
      )}
    </div>
  );
};

export default SearchPage;
