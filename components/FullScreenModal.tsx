
import React from 'react';
import type { Wallpaper } from '../types';
import { Icon } from './Icon';

interface FullScreenModalProps {
  wallpaper: Wallpaper;
  onClose: () => void;
  onDownload: () => void;
  onRemix: () => void;
}

const ActionButton: React.FC<{
  onClick: () => void;
  iconName: 'download' | 'remix';
  children: React.ReactNode;
}> = ({ onClick, iconName, children }) => (
  <button
    onClick={onClick}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-md transition-colors duration-300"
  >
    <Icon name={iconName} className="h-5 w-5" />
    <span>{children}</span>
  </button>
);

export const FullScreenModal: React.FC<FullScreenModalProps> = ({ wallpaper, onClose, onDownload, onRemix }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-lg animate-fade-in"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={`data:image/jpeg;base64,${wallpaper.base64}`}
          alt="Full screen wallpaper"
          className="max-h-full max-w-full object-contain rounded-xl shadow-2xl shadow-black/50"
        />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors"
          aria-label="Close"
        >
          <Icon name="close" className="h-6 w-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 flex items-center gap-4">
          <ActionButton onClick={onDownload} iconName="download">Download</ActionButton>
          <ActionButton onClick={onRemix} iconName="remix">Remix</ActionButton>
        </div>
      </div>
    </div>
  );
};
