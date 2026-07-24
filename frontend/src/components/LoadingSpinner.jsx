import React from 'react';
import { Film } from 'lucide-react';

export const LoadingSpinner = ({
  message = 'Loading CineAddict experience...',
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-900/30 border-t-red-600 rounded-full animate-spin"></div>
        <Film className="absolute w-6 h-6 text-red-500 animate-pulse" />
      </div>
      {message && <p className="text-gray-400 text-sm font-medium tracking-wide animate-pulse">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0d0e12]">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
