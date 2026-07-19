import movies from "../../data/movie";
import MovieSection from "../../movieSection/MovieSection";
const HomeSection = () => {
  return (
    <div>
      <MovieSection title="Trending Movies" movies={movies} />

      <MovieSection title="Popular Movies" movies={movies} />

      <MovieSection title="Top Rated" movies={movies} />
    </div>
  );
};

export default HomeSection;
