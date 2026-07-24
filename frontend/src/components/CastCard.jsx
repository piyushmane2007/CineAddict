import React from 'react';
import { getImageUrl } from '../utils/movieHelpers';

export const CastCard = ({ cast }) => {
  if (!cast) return null;

  const photoPath = cast.profile_path || cast.profile_url || cast.photo;
  const actorName = cast.name || 'Unknown Actor';
  const character = cast.character || cast.role || '';

  return (
    <div className="flex-shrink-0 w-28 sm:w-32 bg-[#151722] rounded-xl overflow-hidden border border-gray-800/80 hover:border-gray-700 transition-colors">
      <div className="aspect-[3/4] w-full bg-gray-900 overflow-hidden">
        <img
          src={getImageUrl(photoPath, 'profile')}
          alt={actorName}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
          }}
        />
      </div>
      <div className="p-2.5">
        <p className="font-semibold text-xs text-gray-200 line-clamp-1" title={actorName}>
          {actorName}
        </p>
        {character && (
          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5" title={character}>
            {character}
          </p>
        )}
      </div>
    </div>
  );
};

export default CastCard;
