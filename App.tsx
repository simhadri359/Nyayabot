import React, { useState } from 'react';
import SideMenu from './components/SideMenu';
import ChatInterface from './components/ChatInterface';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PrivacyModal from './components/PrivacyModal';

type View = 'chat' | 'analytics';

function App() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  
  // A key to force-remount ChatInterface on "New Chat"
  const [chatKey, setChatKey] = useState(0);

  const handleNewChat = () => {
    setChatKey(prevKey => prevKey + 1);
    setCurrentView('chat');
  };

  const renderView = () => {
    switch (currentView) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'chat':
      default:
        return <ChatInterface key={chatKey} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 font-sans">
      <SideMenu
        currentView={currentView}
        onSetView={setCurrentView}
        onShowPrivacy={() => setIsPrivacyModalOpen(true)}
        onNewChat={handleNewChat}
      />
      <main className="flex-1 flex flex-col h-screen">
        {renderView()}
      </main>
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default App;
