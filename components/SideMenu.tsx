import React from 'react';
import { ChatBubbleLeftRightIcon, ChartPieIcon, ShieldCheckIcon, NyayaBotIcon } from './IconComponents';

interface SideMenuProps {
  currentView: string;
  onSetView: (view: 'chat' | 'analytics') => void;
  onShowPrivacy: () => void;
  onNewChat: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ currentView, onSetView, onShowPrivacy, onNewChat }) => {
  return (
    <div className="w-64 bg-gray-900 text-gray-300 flex flex-col h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
          <NyayaBotIcon className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-white">Nyaya</h1>
      </div>
      <button 
        onClick={onNewChat}
        className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 mb-6"
      >
        + New Chat
      </button>
      <nav className="flex-1 space-y-2">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onSetView('chat'); }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${currentView === 'chat' ? 'bg-gray-700/50 text-white' : 'hover:bg-gray-800'}`}
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span>Chat</span>
        </a>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onSetView('analytics'); }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${currentView === 'analytics' ? 'bg-gray-700/50 text-white' : 'hover:bg-gray-800'}`}
        >
          <ChartPieIcon className="w-5 h-5" />
          <span>Analytics</span>
        </a>
      </nav>
      <div className="mt-auto">
         <a
          href="#"
          onClick={(e) => { e.preventDefault(); onShowPrivacy(); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          <ShieldCheckIcon className="w-5 h-5" />
          <span>Privacy & Info</span>
        </a>
      </div>
    </div>
  );
};

export default SideMenu;