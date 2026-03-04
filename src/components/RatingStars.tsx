import React from 'react';

type RatingStarsProps = {
  rating: number;
  starClass?: string;
  activeClass?: string;
  inactiveClass?: string;
};

export const StarSVG = ({ filled, className = '' }: { filled: boolean; className?: string }) => {
  const path = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z';
  if (filled) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d={path} />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d={path} />
    </svg>
  );
};

export default function RatingStars({ rating, starClass = 'w-4 h-4', activeClass = 'text-[#D92128]', inactiveClass = 'text-gray-300' }: RatingStarsProps) {
  const n = Math.floor(Number(rating) || 0);
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarSVG key={i} filled={i < n} className={`${starClass} ${i < n ? activeClass : inactiveClass}`} />
      ))}
    </span>
  );
}
