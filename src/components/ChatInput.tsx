import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled = false 
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Adicione sua chave da API Gemini para começar..." : "Digite sua mensagem..."}
              disabled={disabled || isLoading}
              className={`w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl resize-none 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
                transition-all duration-200 max-h-[120px] overflow-y-auto bg-gray-50`}
              rows={1}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading || disabled}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center
              ${(!input.trim() || isLoading || disabled)
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
              }`}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};