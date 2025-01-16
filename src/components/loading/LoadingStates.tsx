import React from 'react';

export const TalentCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-10 bg-gray-200 rounded w-24 mt-4" />
    </div>
  </div>
);

export const TalentGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <TalentCardSkeleton key={i} />
    ))}
  </div>
);

export const StatusBarSkeleton: React.FC = () => (
  <div className="grid grid-cols-3 gap-4 animate-pulse">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg shadow">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
    ))}
  </div>
);