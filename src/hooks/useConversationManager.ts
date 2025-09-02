import { useState, useCallback, useEffect } from 'react';
import { Conversation, Folder, ChatMessage } from '../types/chat';

const STORAGE_KEYS = {
  CONVERSATIONS: 'chat-conversations',
  FOLDERS: 'chat-folders'
};

export const useConversationManager = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS);

    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
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
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
      }
    }

    if (savedFolders) {
      try {
        const parsed = JSON.parse(savedFolders);
        const foldersWithDates = parsed.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt)
        }));
        setFolders(foldersWithDates);
      } catch (error) {
        console.error('Error loading folders:', error);
        createDefaultFolder();
      }
    } else {
      createDefaultFolder();
    }
  }, []);

  const createDefaultFolder = () => {
    const defaultFolder: Folder = {
      id: 'default',
      name: 'Geral',
      isExpanded: true,
      createdAt: new Date()
    };
    setFolders([defaultFolder]);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
  }, [folders]);

  const createNewConversation = useCallback((initialMessage: ChatMessage): string => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: initialMessage.content.slice(0, 50) + (initialMessage.content.length > 50 ? '...' : ''),
      messages: [initialMessage],
      lastActivity: new Date(),
      folderId: 'default',
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    return newConversation.id;
  }, []);

  const updateConversation = useCallback((conversationId: string, messages: ChatMessage[]) => {
    setConversations(prev => {
      const existingIndex = prev.findIndex(conv => conv.id === conversationId);
      
      if (existingIndex >= 0) {
        // Update existing conversation
        const updated = prev.map(conv => {
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
        });
        return updated;
      } else {
        // Create new conversation if it doesn't exist
        const userMessages = messages.filter(msg => msg.role !== 'system');
        if (userMessages.length > 0) {
          const newConversation: Conversation = {
            id: conversationId,
            title: userMessages[0].content.slice(0, 50) + (userMessages[0].content.length > 50 ? '...' : ''),
            messages,
            lastActivity: new Date(),
            folderId: 'default',
            createdAt: new Date()
          };
          return [newConversation, ...prev];
        }
        return prev;
      }
    });
  }, []);

  const loadConversation = useCallback((conversationId: string): ChatMessage[] => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    return conversation ? conversation.messages : [];
  }, [conversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
  }, []);

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
    if (folderId === 'default') return;
    
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

  return {
    conversations,
    folders,
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
    getConversationsByFolder
  };
};