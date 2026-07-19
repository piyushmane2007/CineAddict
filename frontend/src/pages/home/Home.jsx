import Hero from "../../components/hero/Hero";
import Navbar from "../../components/Navbar/Navbar";

import movies from "../../data/movie";
import MovieSection from "../../movieSection/MovieSection";

function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-zinc-950">
        <Hero />
        <MovieSection title="Trending Movies" movies={movies} />

        <MovieSection title="Popular Movies" movies={movies} />

        <MovieSection title="Top Rated" movies={movies} />
      </main>
    </>
  );
}
export default Home;
