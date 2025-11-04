
import React from 'react';
import type { Wallpaper } from '../types';

interface ImageGridProps {
  wallpapers: Wallpaper[];
  onImageClick: (wallpaper: Wallpaper) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ wallpapers, onImageClick }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4">
      {wallpapers.map((wallpaper) => (
        <div 
          key={wallpaper.id} 
          className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-purple-500/30"
          onClick={() => onImageClick(wallpaper)}
        >
          <img
            src={`data:image/jpeg;base64,${wallpaper.base64}`}
            alt="Generated wallpaper"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
