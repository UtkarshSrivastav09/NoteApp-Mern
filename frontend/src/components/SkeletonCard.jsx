import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-2xl shadow-xl border border-gray-200 animate-pulse flex flex-col justify-between h-full">
      {/* Title */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-4 w-12 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-10 bg-gray-300 rounded-full"></div>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-auto">
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
