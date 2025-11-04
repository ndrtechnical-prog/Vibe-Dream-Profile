
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
);

const MESSAGES = [
  "Conjuring your vibe...",
  "Painting pixels...",
  "Brewing creativity...",
  "Reticulating splines...",
  "Assembling aesthetics...",
];

export const LoadingState: React.FC = () => {
  const [message, setMessage] = React.useState(MESSAGES[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex flex-col justify-center items-center z-50">
      <LoadingSpinner />
      <p className="mt-6 text-lg text-gray-200 font-medium tracking-wide">{message}</p>
    </div>
  );
};
