import React from 'react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMain } from './components/ChatMain';
import { useChat } from './hooks/useChat';

function App() {
  const {
    messages,
    isLoading,
    error,
    totalTokens,
    sendMessage,
    clearConversation,
    exportConversation,
    isConfigured
  } = useChat();

  return (
    <div className="h-screen flex bg-gray-100">
      <ChatSidebar 
        onClearChat={clearConversation}
        onExportChat={exportConversation}
        messagesCount={messages.filter(msg => msg.role !== 'system').length}
      />
      
      <ChatMain
        messages={messages}
        isLoading={isLoading}
        error={error}
        totalTokens={totalTokens}
        onSendMessage={sendMessage}
        onClearConversation={clearConversation}
        onExportConversation={exportConversation}
        isConfigured={isConfigured}
      />
    </div>
  );
}

export default App;