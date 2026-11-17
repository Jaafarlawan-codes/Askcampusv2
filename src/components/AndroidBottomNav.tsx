import React from 'react';
import { 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  User 
} from 'lucide-react';
import { StudentProfile } from '../types';

interface AndroidBottomNavProps {
  currentTab: 'questions' | 'marketplace' | 'studygroups' | 'copilot' | 'profile' | 'saved';
  setCurrentTab: (tab: 'questions' | 'marketplace' | 'studygroups' | 'copilot' | 'profile' | 'saved') => void;
  onOpenActionSheet?: () => void;
  currentUser: StudentProfile;
  unreadCount?: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shrink-0 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] sm:max-w-lg sm:mx-auto sm:rounded-t-3xl sm:border-x">
      {/* 1. Academic Q&A */}
      <button
        onClick={() => setCurrentTab('questions')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
          currentTab === 'questions' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1 rounded-lg transition-all ${
          currentTab === 'questions' ? 'bg-blue-50 text-blue-600' : ''
        }`}>
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'questions' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
        }`}>
          Q&A Feed
        </span>
      </button>

      {/* 2. Study Groups */}
      <button
        onClick={() => setCurrentTab('studygroups')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
          currentTab === 'studygroups' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1 rounded-lg transition-all ${
          currentTab === 'studygroups' ? 'bg-blue-50 text-blue-600' : ''
        }`}>
          <Users className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'studygroups' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
        }`}>
          Study Groups
        </span>
      </button>

      {/* 3. Marketplace */}
      <button
        onClick={() => setCurrentTab('marketplace')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
          currentTab === 'marketplace' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1 rounded-lg transition-all ${
          currentTab === 'marketplace' ? 'bg-blue-50 text-blue-600' : ''
        }`}>
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'marketplace' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
        }`}>
          Marketplace
        </span>
      </button>

      {/* 4. AI Copilot */}
      <button
        onClick={() => setCurrentTab('copilot')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
          currentTab === 'copilot' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1 rounded-lg transition-all ${
          currentTab === 'copilot' ? 'bg-amber-50 text-amber-600' : ''
        }`}>
          <Sparkles className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'copilot' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
        }`}>
          AI Copilot
        </span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => setCurrentTab('profile')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
          currentTab === 'profile' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-0.5 rounded-full transition-all ring-2 ${
          currentTab === 'profile' ? 'ring-blue-600' : 'ring-transparent'
        }`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-5 h-5 rounded-full object-cover"
          />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'profile' ? 'text-blue-600 font-extrabold' : 'text-slate-500'
        }`}>
          Profile
        </span>
      </button>
    </nav>
  );
};
