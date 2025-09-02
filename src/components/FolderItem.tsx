import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, MoreVertical, Edit2, Trash2, Plus } from 'lucide-react';
import { Folder as FolderType, Conversation } from '../types/chat';
import { ConversationItem } from './ConversationItem';

interface FolderItemProps {
  folder: FolderType;
  conversations: Conversation[];
  currentConversationId: string | null;
  folders: FolderType[];
  onToggle: (folderId: string) => void;
  onRename: (folderId: string, newName: string) => void;
  onDelete: (folderId: string) => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onMoveConversation: (conversationId: string, folderId: string) => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  conversations,
  currentConversationId,
  folders,
  onToggle,
  onRename,
  onDelete,
  onSelectConversation,
  onDeleteConversation,
  onMoveConversation
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      onRename(folder.id, newName.trim());
    }
    setIsRenaming(false);
    setNewName(folder.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewName(folder.name);
    }
  };

  return (
    <div className="mb-2">
      {/* Folder Header */}
      <div className="group flex items-center gap-2 px-2 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 relative">
        <button
          onClick={() => onToggle(folder.id)}
          className="p-1 hover:bg-slate-600 rounded transition-colors duration-200"
        >
          {folder.isExpanded ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </button>
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {folder.isExpanded ? (
            <FolderOpen size={16} className="flex-shrink-0" />
          ) : (
            <Folder size={16} className="flex-shrink-0" />
          )}
          
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="bg-slate-600 text-white text-sm px-2 py-1 rounded border-none outline-none flex-1"
              autoFocus
            />
          ) : (
            <span 
              className="text-sm font-medium truncate cursor-pointer"
              onClick={() => onToggle(folder.id)}
            >
              {folder.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 bg-slate-600 px-2 py-1 rounded-full">
            {conversations.length}
          </span>
          
          {folder.id !== 'default' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-all duration-200"
            >
              <MoreVertical size={14} />
            </button>
          )}
        </div>

        {/* Folder Context Menu */}
        {showMenu && folder.id !== 'default' && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-8 z-20 bg-slate-700 border border-slate-600 rounded-lg shadow-lg py-1 min-w-[140px]">
              <button
                onClick={() => {
                  setIsRenaming(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Edit2 size={14} />
                Renomear
              </button>
              <button
                onClick={() => {
                  onDelete(folder.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          </>
        )}
      </div>

      {/* Conversations in Folder */}
      {folder.isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {conversations.map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === currentConversationId}
              folders={folders}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
              onMoveToFolder={onMoveConversation}
            />
          ))}
          
          {conversations.length === 0 && (
            <div className="px-3 py-2 text-xs text-slate-500 italic">
              Nenhuma conversa nesta pasta
            </div>
          )}
        </div>
      )}
    </div>
  );
};