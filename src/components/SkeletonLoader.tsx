import React from 'react';

export const SiteLoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-pulse">
      {/* Top Hero Skeleton with Ecosia full-bleed preview structure */}
      <div className="rounded-[20px] bg-[#f8f8f6] p-8 sm:p-14 min-h-[420px] flex flex-col justify-between border border-[#bebeb9]/30">
        <div className="skeleton-ecosia-pill w-44 h-5 mb-6" />
        <div className="space-y-4 max-w-2xl mx-auto w-full flex flex-col items-center">
          <div className="skeleton-ecosia-pill w-4/5 h-12" />
          <div className="skeleton-ecosia-pill w-3/5 h-12" />
          <div className="skeleton-ecosia-pill w-2/3 h-5 mt-3" />
          {/* Mock Pill Search Bar */}
          <div className="skeleton-ecosia-pill w-full max-w-lg h-14 mt-6" />
        </div>
        {/* Floating dark stats mockup */}
        <div className="skeleton-ecosia w-full max-w-xl mx-auto h-20 rounded-[20px] mt-8" />
      </div>

      {/* 4-Column Nature Cards Skeleton */}
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="skeleton-ecosia-pill w-36 h-4" />
          <div className="skeleton-ecosia-pill w-80 h-10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[20px] bg-[#f8f8f6] p-4 space-y-4">
              <div className="skeleton-ecosia w-full h-44 rounded-[20px]" />
              <div className="skeleton-ecosia-pill w-3/4 h-5" />
              <div className="skeleton-ecosia-pill w-full h-4" />
              <div className="skeleton-ecosia-pill w-2/3 h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Transparency Split Skeleton */}
      <div className="rounded-[20px] bg-[#f0f0eb] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="skeleton-ecosia w-64 h-64 mx-auto rounded-full" />
        <div className="space-y-4">
          <div className="skeleton-ecosia-pill w-32 h-4" />
          <div className="skeleton-ecosia-pill w-4/5 h-10" />
          <div className="skeleton-ecosia-pill w-full h-16" />
          <div className="skeleton-ecosia-pill w-44 h-11 mt-4" />
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-[20px] bg-[#f8f8f6] p-6 space-y-4">
          <div className="skeleton-ecosia w-full h-40 rounded-[20px]" />
          <div className="skeleton-ecosia-pill w-48 h-5" />
          <div className="skeleton-ecosia-pill w-full h-10" />
          <div className="flex justify-between items-center pt-2">
            <div className="skeleton-ecosia-pill w-20 h-4" />
            <div className="skeleton-ecosia-pill w-28 h-9" />
          </div>
        </div>
      ))}
    </div>
  );
};
