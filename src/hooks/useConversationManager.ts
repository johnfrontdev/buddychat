import { useState, useCallback, useEffect } from 'react';
import { Conversation, Folder, ChatMessage } from '../types/chat';

const STORAGE_KEYS = {
  CONVERSATIONS: 'chat-conversations',
  FOLDERS: 'chat-folders',
  CURRENT_CONVERSATION: 'current-conversation-id'
};

export const useConversationManager = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    const savedCurrentId = localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);

    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      // Convert timestamp strings back to Date objects
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        lastActivity: new Date(conv.lastActivity),
        createdAt: new Date(conv.createdAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(conversationsWithDates);
    }

    if (savedFolders) {
      const parsed = JSON.parse(savedFolders);
      const foldersWithDates = parsed.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt)
      }));
      setFolders(foldersWithDates);
    } else {
      // Create default folder
      const defaultFolder: Folder = {
        id: 'default',
        name: 'General',
        isExpanded: true,
        createdAt: new Date()
      };
      setFolders([defaultFolder]);
    }

    if (savedCurrentId) {
      setCurrentConversationId(savedCurrentId);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, currentConversationId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    }
  }, [currentConversationId]);

  const createNewConversation = useCallback((initialMessage?: ChatMessage): string => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: initialMessage ? 
        initialMessage.content.slice(0, 50) + (initialMessage.content.length > 50 ? '...' : '') :
        'Nova Conversa',
      messages: initialMessage ? [initialMessage] : [],
      lastActivity: new Date(),
      folderId: 'default',
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  const updateConversation = useCallback((conversationId: string, messages: ChatMessage[]) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const userMessages = messages.filter(msg => msg.role !== 'system');
        const title = userMessages.length > 0 ? 
          userMessages[0].content.slice(0, 50) + (userMessages[0].content.length > 50 ? '...' : '') :
          'Nova Conversa';
        
        return {
          ...conv,
          title,
          messages,
          lastActivity: new Date()
        };
      }
      return conv;
    }));
  }, []);

  const loadConversation = useCallback((conversationId: string): ChatMessage[] => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      return conversation.messages;
    }
    return [];
  }, [conversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  }, [currentConversationId]);

  const createFolder = useCallback((name: string): string => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      isExpanded: true,
      createdAt: new Date()
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder.id;
  }, []);

  const renameFolder = useCallback((folderId: string, newName: string) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, name: newName } : folder
    ));
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    if (folderId === 'default') return; // Can't delete default folder
    
    // Move conversations to default folder
    setConversations(prev => prev.map(conv => 
      conv.folderId === folderId ? { ...conv, folderId: 'default' } : conv
    ));
    
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ));
  }, []);

  const moveConversationToFolder = useCallback((conversationId: string, folderId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, folderId } : conv
    ));
  }, []);

  const getConversationsByFolder = useCallback((folderId: string) => {
    return conversations
      .filter(conv => conv.folderId === folderId)
      .filter(conv => {
        if (!searchQuery) return true;
        return conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
      })
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }, [conversations, searchQuery]);

  const getCurrentConversation = useCallback((): Conversation | null => {
    if (!currentConversationId) return null;
    return conversations.find(conv => conv.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  return {
    conversations,
    folders,
    currentConversationId,
    searchQuery,
    setSearchQuery,
    createNewConversation,
    updateConversation,
    loadConversation,
    deleteConversation,
    createFolder,
    renameFolder,
    deleteFolder,
    toggleFolder,
    moveConversationToFolder,
    getConversationsByFolder,
    getCurrentConversation
  };
};