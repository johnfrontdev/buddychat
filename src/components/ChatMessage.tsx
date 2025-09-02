import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${isLast ? 'animate-in slide-in-from-bottom-2 duration-300' : ''}`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Sender and timestamp */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-sm font-medium text-slate-700">
            {isUser ? 'Me' : 'John'}
          </span>
          <span className="text-xs text-slate-500">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message bubble */}
        <div className={`p-4 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};