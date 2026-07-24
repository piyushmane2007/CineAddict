import React from "react";
import { X, Film } from "lucide-react";

export const TrailerModal = ({
  isOpen,
  onClose,
  movieTitle,
  youtubeId,
  trailerUrl,
}) => {
  if (!isOpen) return null;

  // Extract YouTube video ID if full URL is passed
  let embedId = youtubeId;
  if (!embedId && trailerUrl) {
    if (trailerUrl.includes("youtube.com/watch?v=")) {
      embedId = trailerUrl.split("v=")[1]?.split("&")[0];
    } else if (trailerUrl.includes("youtu.be/")) {
      embedId = trailerUrl.split("youtu.be/")[1]?.split("?")[0];
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#12141e] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Film className="w-5 h-5 text-red-500" />
            <span className="truncate">{movieTitle} - Official Trailer</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player Embed */}
        <div className="relative aspect-video w-full bg-black">
          {embedId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&rel=0`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
              <Film className="w-16 h-16 text-gray-700 stroke-1 animate-pulse" />
              <p className="text-gray-300 font-medium">
                Trailer preview currently unavailable.
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${movieTitle} official trailer`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                Search Trailer on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
