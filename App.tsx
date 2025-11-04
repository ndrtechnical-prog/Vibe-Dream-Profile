
import React, { useState, useCallback } from 'react';
import { generateInitialWallpapers, remixWallpaper } from './services/geminiService';
import type { Wallpaper } from './types';
import { ImageGrid } from './components/ImageGrid';
import { FullScreenModal } from './components/FullScreenModal';
import { LoadingState } from './components/LoadingState';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('rainy cyberpunk lo-fi');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  const handleGeneration = useCallback(async (isRemix: boolean = false) => {
    if (!prompt.trim()) {
      setError('Please enter a vibe for your wallpaper.');
      return;
    }
    setIsLoading(true);
    setError(null);
    if(isRemix && selectedWallpaper) {
        setSelectedWallpaper(null);
    }

    try {
      let newImagesBase64: string[];
      if (isRemix && selectedWallpaper) {
        newImagesBase64 = await remixWallpaper(prompt, selectedWallpaper.base64);
      } else {
        newImagesBase64 = await generateInitialWallpapers(prompt);
      }
      
      const newWallpapers = newImagesBase64.map(base64 => ({
        id: crypto.randomUUID(),
        base64,
      }));
      setWallpapers(newWallpapers);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, selectedWallpaper]);

  const handleImageClick = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
  };

  const handleCloseModal = () => {
    setSelectedWallpaper(null);
  };

  const handleDownload = () => {
    if (!selectedWallpaper) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${selectedWallpaper.base64}`;
    link.download = `${prompt.replace(/\s+/g, '_')}_${selectedWallpaper.id.substring(0,6)}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleRemix = () => {
    if (!selectedWallpaper) return;
    handleGeneration(true);
  };

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-[calc(100vh-200px)]">
      <div className="mb-6">
        <Icon name="generate" className="w-20 h-20 text-purple-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">VibeWallpapers AI</h2>
      <p className="text-gray-400 max-w-md">
        Describe any vibe, scene, or aesthetic, and we'll generate four unique wallpapers for your phone.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {isLoading && <LoadingState />}
      
      <main className="flex-grow container mx-auto max-w-2xl">
        <div className="pt-8 px-4">
            <h1 className="text-center text-4xl font-extrabold text-white tracking-tight mb-1">
                Vibe<span className="text-purple-400">Wallpapers</span>
            </h1>
            <p className="text-center text-gray-400 mb-8">Craft your perfect phone background with AI.</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mx-4 mb-4" role="alert">
            <strong className="font-bold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {wallpapers.length > 0 ? (
          <ImageGrid wallpapers={wallpapers} onImageClick={handleImageClick} />
        ) : (
          !isLoading && <WelcomeScreen />
        )}
      </main>

      <footer className="sticky bottom-0 bg-gray-900/50 backdrop-blur-lg border-t border-gray-700/50 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., enchanted forest at midnight"
              className="flex-grow bg-gray-800 text-white border-2 border-gray-700 focus:border-purple-500 focus:ring-0 rounded-full py-3 px-5 w-full transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleGeneration()}
            />
            <button
              onClick={() => handleGeneration()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-100"
            >
              <Icon name="generate" className="h-5 w-5" />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </footer>

      {selectedWallpaper && (
        <FullScreenModal
          wallpaper={selectedWallpaper}
          onClose={handleCloseModal}
          onDownload={handleDownload}
          onRemix={handleRemix}
        />
      )}
    </div>
  );
};

export default App;
