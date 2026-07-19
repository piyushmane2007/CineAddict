import { Star, Calendar, Clock3, Play, Info } from "lucide-react";
import heroMovie from "../../data/heroMovie";
function Hero() {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroMovie.backdrop})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          {/* Movie Info */}
          <div className="mb-4 flex flex-wrap items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{heroMovie.rating}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-400" />
              <span>{heroMovie.year}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-orange-400" />
              <span>{heroMovie.runtime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="max-w-3xl text-5xl font-extrabold text-white md:text-7xl">
            {heroMovie.title}
          </h1>

          {/* Genres */}
          <div className="mt-6 flex flex-wrap gap-3">
            {heroMovie.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-orange-500 px-4 py-1 text-sm text-orange-400"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            {heroMovie.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:scale-105">
              <Play className="h-5 w-5 fill-white" />
              Watch Trailer
            </button>

            <button className="flex items-center gap-2 rounded-lg border border-gray-500 bg-black/40 px-6 py-3 font-semibold text-white transition-all duration-300 hover:border-orange-500 hover:bg-orange-500/20">
              <Info className="h-5 w-5" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
