import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '../types/chat';
import { openaiService } from '../services/gemini';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date()
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      const { message: assistantMessage, usage } = await openaiService.sendMessage(updatedMessages, input);
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setTotalTokens(prev => prev + usage.total_tokens);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setTotalTokens(0);
    setCurrentConversationId(null);
  }, []);

  const loadConversation = useCallback((conversationMessages: ChatMessage[], conversationId?: string) => {
    setMessages(conversationMessages);
    setError(null);
    if (conversationId) {
      setCurrentConversationId(conversationId);
    }
    // Calculate total tokens from loaded messages
    const tokens = conversationMessages.reduce((sum, msg) => sum + (msg.tokens || 0), 0);
    setTotalTokens(tokens);
  }, []);

  const exportConversation = useCallback(() => {
    const conversationData = {
      messages,
      totalTokens,
      exportedAt: new Date().toISOString(),
      model: openaiService.getModel()
    };

    const blob = new Blob([JSON.stringify(conversationData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, totalTokens]);

  return {
    messages,
    isLoading,
    error,
    totalTokens,
    currentConversationId,
    sendMessage,
    clearConversation,
    loadConversation,
    exportConversation,
    isConfigured: openaiService.isConfigured()
  };
};