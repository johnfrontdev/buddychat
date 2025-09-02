import React from 'react';
import { MessageCircle, Shield } from 'lucide-react';

interface EmptyStateProps {
  onSampleMessage: (message: string) => void;
  isConfigured: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSampleMessage, isConfigured }) => {
  const sampleMessages = [
      "Quem é você?",
    "Como você trabalha com agências?",
    "Preciso de uma landing page rápida"
  ];

  if (!isConfigured) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={24} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">API Key Required</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            To start chatting, please add your Gemini API key to the <code className="bg-slate-100 px-2 py-1 rounded text-sm">.env</code> file.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-sm">
            <p className="font-medium text-slate-700 mb-2">Setup steps:</p>
            <ol className="text-slate-600 space-y-1 list-decimal list-inside">
              <li>Copy <code>.env.example</code> to <code>.env</code></li>
              <li>Add your Gemini API key to <code>VITE_GEMINI_API_KEY</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MessageCircle size={24} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Começar a conversa com John
        </h2>
        <p className="text-slate-600 leading-relaxed mb-8">
          Clique em alguma pergunta para começar a conversar com John.
        </p>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {sampleMessages.map((message, index) => (
            <button
              key={index}
              onClick={() => onSampleMessage(message)}
              className="text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 
                hover:shadow-md transition-all duration-200 group"
            >
              <p className="text-sm text-slate-700 group-hover:text-blue-700 transition-colors duration-200">
                {message}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};