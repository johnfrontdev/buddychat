import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSampleMessage: (message: string) => void;
  isConfigured: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  onSampleMessage,
  isConfigured
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const userMessages = messages.filter(msg => msg.role !== 'system');

  if (userMessages.length === 0) {
    return <EmptyState onSampleMessage={onSampleMessage} isConfigured={isConfigured} />;
  }

  return (
    <div 
      ref={scrollAreaRef}
      className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-4xl mx-auto">
        {userMessages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isLast={index === userMessages.length - 1}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
};