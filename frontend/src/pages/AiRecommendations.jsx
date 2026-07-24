import React, { useState } from 'react';
import { Sparkles, Send, Film, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

export const AiRecommendations = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const samplePrompts = [
    'Mind-bending psychological thrillers with high stakes and unexpected twists',
    'Feel-good nostalgic 80s sci-fi adventure movies for a Friday night',
    'Gripping crime detective mystery set in rain-soaked moody cities',
    'Epic space opera with stunning visuals, aliens, and deep space exploration',
  ];

  const handleGetRecommendations = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setSearched(true);
    setError(null);

    try {
      const results = await apiService.getAiRecommendations(prompt.trim());
      setRecommendations(results);
    } catch (err) {
      console.error('AI Recommendation Error:', err);
      setError('Could not process AI recommendation request. Ensure your Flask server has the AI endpoint active.');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleClick = (sample) => {
    setPrompt(sample);
  };

  return (
    <div className="space-y-8 py-6">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white shadow-xl shadow-red-600/20 mb-1">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">AI Movie Recommendations</h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
          Describe what mood, plot, theme, or vibe you are craving. CineAddict AI will match your request with curated movie cards.
        </p>

        {/* Input Form */}
        <form onSubmit={handleGetRecommendations} className="relative mt-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. I want an atmospheric sci-fi movie with time travel, emotional storytelling, and a haunting synth soundtrack..."
            className="w-full p-4 pr-32 bg-[#131520] border border-gray-700/80 rounded-2xl text-[#f3f4f6] text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-2xl resize-none"
          />

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-3 bottom-3 px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-1.5"
          >
            {isLoading ? 'Analyzing...' : 'Get Recommendations'}
            {!isLoading && <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Sample Prompt Chips */}
        <div className="pt-2 text-left space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Try an idea:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="px-3 py-1.5 bg-[#161824] hover:bg-red-950/40 hover:text-red-300 border border-gray-800 rounded-xl text-xs text-gray-300 transition-colors text-left"
              >
                &quot;{sample}&quot;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-950/80 border border-red-500/40 rounded-2xl p-4 text-red-300 text-xs flex items-center gap-3 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-12">
          <LoadingSpinner message="Consulting AI recommendation engine..." />
        </div>
      )}

      {/* Results Display as Movie Cards */}
      {!isLoading && searched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI Matched Recommendations
            </h2>
            <span className="text-xs text-gray-400 font-semibold">{recommendations.length} movies found</span>
          </div>

          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-[#131520] rounded-2xl border border-gray-800 text-center space-y-3">
              <Film className="w-12 h-12 text-gray-600 stroke-1" />
              <h3 className="text-base font-semibold text-gray-300">No matching recommendations found</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Try refining your prompt with more specific themes, actors, or movie titles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {recommendations.map((item, idx) => (
                <MovieCard key={item.id ? `${item.id}-${idx}` : idx} movie={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiRecommendations;
