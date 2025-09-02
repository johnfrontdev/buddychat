import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6 mt-4 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800 leading-relaxed">{error}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};