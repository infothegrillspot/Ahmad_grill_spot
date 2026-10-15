import React, { useState, useEffect } from 'react';
import { BANNERS } from '../data/menuData.ts';

interface HeroBannerProps {
  onSelectBannerPromo?: (bannerId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectBannerPromo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentIndex];

  return (
    <div className="relative w-full bg-black overflow-hidden select-none">
      {/* Banner Container with 16:9 ratio */}
      <div 
        className="relative w-full aspect-[16/9] cursor-pointer"
        onClick={() => onSelectBannerPromo?.(banner.id)}
      >
        <img
          src={banner.image}
          alt={banner.tag}
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
        />

        {/* Gradient Overlay for high-contrast text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 flex flex-col justify-between p-4">
          {/* Top Tag & Brand Neon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl">🔥</span>
              <span className="text-white text-xs font-black tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                THE GRILL SPOT
              </span>
            </div>
            {banner.badge && (
              <span className="bg-[#E32626] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow">
                {banner.badge}
              </span>
            )}
          </div>

          {/* Middle / Bottom Content */}
          <div className="flex items-end justify-between">
            <div className="max-w-[65%]">
              <h2 className="text-white font-black text-xl leading-tight uppercase tracking-tight drop-shadow-md">
                {banner.tag}
              </h2>
              <p className="text-zinc-200 text-xs font-medium line-clamp-1 mt-0.5 drop-shadow">
                {banner.subtitle}
              </p>
            </div>

            {/* Price Badge matching screenshot */}
            <div className="bg-[#E32626] text-white rounded-lg px-2.5 py-1 text-right shadow-lg">
              <div className="text-sm font-black leading-none">{banner.highlight}</div>
              <div className="text-[10px] line-through text-white/80 font-medium">
                {banner.original}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Indicator Dots (matching 10 dots in screenshots) */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center space-x-1.5 z-10 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => {
          const isActive = i % BANNERS.length === currentIndex;
          return (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-4 h-1.5 bg-white shadow-sm'
                  : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
