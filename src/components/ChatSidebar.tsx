import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Settings, RotateCcw, LogOut, Menu, Search, Plus, FolderPlus, History } from 'lucide-react';
import { FolderItem } from './FolderItem';
import { useConversationManager } from '../hooks/useConversationManager';
import { ChatMessage } from '../types/chat';

interface ChatSidebarProps {
  onClearChat: () => void;
  onExportChat: () => void;
  messagesCount: number;
  messages: ChatMessage[];
  currentConversationId: string | null;
  onLoadConversation: (messages: ChatMessage[], conversationId?: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onClearChat,
  onExportChat,
  messagesCount,
  messages,
  currentConversationId,
  onLoadConversation
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const {
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
  } = useConversationManager();

  // Detecta se é mobile e define estado inicial
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Save current conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const userMessages = messages.filter(msg => msg.role !== 'system');
      if (userMessages.length > 0) {
        if (currentConversationId) {
          updateConversation(currentConversationId, messages);
        } else {
          // Create new conversation if none exists
          createNewConversation(userMessages[0]);
        }
      }
    }
  }, [messages, currentConversationId, updateConversation, createNewConversation]);

  const handleNewConversation = () => {
    onClearChat();
    setActiveTab('chat');
  };

  const handleSelectConversation = (conversationId: string) => {
    const conversationMessages = loadConversation(conversationId);
    onLoadConversation(conversationMessages, conversationId);
    setActiveTab('chat');
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleNewFolderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFolder();
    } else if (e.key === 'Escape') {
      setShowNewFolderInput(false);
      setNewFolderName('');
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} min-w-0`}>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            {!isCollapsed && (
              <span className="font-medium whitespace-nowrap">buddychat</span>
            )}
          </div>
          
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
              aria-label="Recolher sidebar"
            >
              <Menu size={16} />
            </button>
          )}
        </div>
        
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mt-3 w-full p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
            aria-label="Expandir sidebar"
          >
            <Menu size={16} />
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      {!isCollapsed && (
        <div className="px-4 pb-2">
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                activeTab === 'chat' 
                  ? 'bg-slate-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare size={14} />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                activeTab === 'history' 
                  ? 'bg-slate-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History size={14} />
              Histórico
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && !isCollapsed && (
          <div className="p-4">
            <nav className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors duration-200">
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">Profile</span>
              </div>
              
              <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors duration-200">
                <Settings size={16} className="flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">Contacts</span>
              </div>
              
              <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors duration-200">
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">Feedback</span>
              </div>
            </nav>
          </div>
        )}

        {activeTab === 'history' && !isCollapsed && (
          <div className="p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* New Conversation Button */}
            <button
              onClick={handleNewConversation}
              className="w-full flex items-center gap-3 px-3 py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Nova Conversa</span>
            </button>

            {/* New Folder Input */}
            {showNewFolderInput && (
              <div className="mb-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
                <input
                  type="text"
                  placeholder="Nome da pasta..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={handleNewFolderKeyDown}
                  onBlur={handleCreateFolder}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}

            {/* Create Folder Button */}
            <button
              onClick={() => setShowNewFolderInput(true)}
              className="w-full flex items-center gap-3 px-3 py-2 mb-4 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 border border-slate-600 border-dashed"
            >
              <FolderPlus size={16} />
              <span className="text-sm">Nova Pasta</span>
            </button>

            {/* Folders and Conversations */}
            <div className="space-y-1">
              {folders.map(folder => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  conversations={getConversationsByFolder(folder.id)}
                  currentConversationId={currentConversationId}
                  folders={folders}
                  onToggle={toggleFolder}
                  onRename={renameFolder}
                  onDelete={deleteFolder}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={deleteConversation}
                  onMoveConversation={moveConversationToFolder}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-700 space-y-2 flex-shrink-0">
        <button
          onClick={onClearChat}
          disabled={messagesCount === 0}
          className={`w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Clear Chat' : undefined}
        >
          <RotateCcw size={16} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm whitespace-nowrap">Clear Chat</span>
          )}
        </button>

        <button className={`w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 ${
          isCollapsed ? 'justify-center' : ''
        }`}
        title={isCollapsed ? 'Log out' : undefined}>
          <LogOut size={16} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm whitespace-nowrap">Log out</span>
          )}
        </button>
        
        {/* Signature */}
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              desenvolvido por{' '}
              <a 
                href="https://instagram.com/johnnightsteel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                @johnnightsteel
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};