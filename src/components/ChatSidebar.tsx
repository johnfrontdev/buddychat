import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Settings, Download, RotateCcw, LogOut, Menu } from 'lucide-react';

interface ChatSidebarProps {
  onClearChat: () => void;
  onExportChat: () => void;
  messagesCount: number;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onClearChat,
  onExportChat,
  messagesCount
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile e define estado inicial
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Se for mobile e é a primeira vez (ou mudou para mobile), colapsar
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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
          
          {/* Botão de toggle na mesma linha quando expandido */}
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
        
        {/* Botão para expandir quando collapsed */}
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

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          <div className={`flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors duration-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Profile' : undefined}>
            <MessageSquare size={16} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm whitespace-nowrap">Profile</span>
            )}
          </div>
          
          <div className={`flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors duration-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Contacts' : undefined}>
            <Settings size={16} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm whitespace-nowrap">Contacts</span>
            )}
          </div>
          
          <div className={`flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors duration-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Feedback' : undefined}>
            <MessageSquare size={16} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm whitespace-nowrap">Feedback</span>
            )}
          </div>
        </nav>
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