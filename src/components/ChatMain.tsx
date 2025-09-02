import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { ErrorBanner } from './ErrorBanner';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMainProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  error: string | null;
  totalTokens: number;
  onSendMessage: (message: string) => void;
  onClearConversation: () => void;
  onExportConversation: () => void;
  isConfigured: boolean;
}

export const ChatMain: React.FC<ChatMainProps> = ({
  messages,
  isLoading,
  error,
  totalTokens,
  onSendMessage,
  onClearConversation,
  onExportConversation,
  isConfigured
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const userMessages = messages.filter(msg => msg.role !== 'system');

  const handleDismissError = () => {
    // Error will be cleared on next successful message
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {error && (
        <ErrorBanner 
          error={error} 
          onDismiss={handleDismissError}
        />
      )}
      
      {userMessages.length === 0 ? (
        <EmptyState onSampleMessage={onSendMessage} isConfigured={isConfigured} />
      ) : (
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="max-w-3xl mx-auto space-y-4">
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
      )}
      
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        disabled={!isConfigured}
      />
    </div>
  );
};