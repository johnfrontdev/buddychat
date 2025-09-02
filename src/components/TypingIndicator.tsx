import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[70%]">
        {/* Sender and timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-700">John</span>
          <span className="text-xs text-slate-500">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Typing bubble */}
        <div className="inline-block p-4 rounded-2xl rounded-bl-md bg-white border border-slate-200 shadow-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};