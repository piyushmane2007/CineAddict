import { Star } from "lucide-react";

function MovieCard({ movie }) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/40">
      {/* Movie Poster */}
      <div className="overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-95 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Card Content */}
      <div className="space-y-3 p-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-300">
            {movie.rating}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 text-lg font-bold text-white">
          {movie.title}
        </h3>

        {/* Genres */}
        <div className="flex flex-wrap gap-2">
          {movie.genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
