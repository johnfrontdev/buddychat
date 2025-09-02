import React from 'react';

interface ChatHeaderProps {
  totalTokens: number;
  messagesCount: number;
  onClearChat: () => void;
  onExportChat: () => void;
  isConfigured: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  totalTokens,
  messagesCount,
  onClearChat,
  onExportChat,
  isConfigured
}) => {
  // This component is no longer used in the new layout
  return null;
};