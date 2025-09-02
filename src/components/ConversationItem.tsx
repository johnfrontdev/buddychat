import React, { useState } from 'react';
import { MessageSquare, MoreVertical, Trash2, FolderOpen } from 'lucide-react';
import { Conversation, Folder } from '../types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  folders: Folder[];
  onSelect: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onMoveToFolder: (conversationId: string, folderId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  folders,
  onSelect,
  onDelete,
  onMoveToFolder
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getLastMessage = () => {
    const userMessages = conversation.messages.filter(msg => msg.role !== 'system');
    const lastMessage = userMessages[userMessages.length - 1];
    if (!lastMessage) return '';
    
    const preview = lastMessage.content.slice(0, 40);
    return preview + (lastMessage.content.length > 40 ? '...' : '');
  };

  return (
    <div className="relative">
      <div
        onClick={() => onSelect(conversation.id)}
        className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          isActive 
            ? 'bg-blue-500 text-white' 
            : 'text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
      >
        <div className="flex items-start gap-3">
          <MessageSquare size={16} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium truncate">{conversation.title}</h4>
              <span className="text-xs opacity-75 flex-shrink-0 ml-2">
                {formatDate(conversation.lastActivity)}
              </span>
            </div>
            {getLastMessage() && (
              <p className="text-xs opacity-75 truncate">
                {getLastMessage()}
              </p>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-all duration-200"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-0 z-20 bg-slate-700 border border-slate-600 rounded-lg shadow-lg py-1 min-w-[160px]">
            <div className="px-3 py-1 text-xs text-slate-400 border-b border-slate-600 mb-1">
              Mover para pasta
            </div>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => {
                  onMoveToFolder(conversation.id, folder.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
              >
                <FolderOpen size={14} />
                {folder.name}
              </button>
            ))}
            <div className="border-t border-slate-600 mt-1 pt-1">
              <button
                onClick={() => {
                  onDelete(conversation.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};