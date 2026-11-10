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
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1.5 py-1.5 flex items-center justify-around shrink-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      {/* 1. Academic Q&A */}
      <button
        onClick={() => setCurrentTab('questions')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer relative ${
          currentTab === 'questions' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${
          currentTab === 'questions' ? 'bg-blue-100/90 text-blue-700 shadow-2xs' : ''
        }`}>
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'questions' ? 'text-blue-700 font-extrabold' : 'text-slate-600'
        }`}>
          Academic
        </span>
      </button>

      {/* 2. Study Groups (Dedicated Tab) */}
      <button
        onClick={() => setCurrentTab('studygroups')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer relative ${
          currentTab === 'studygroups' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all relative ${
          currentTab === 'studygroups' ? 'bg-blue-100/90 text-blue-700 shadow-2xs' : ''
        }`}>
          <Users className="w-5 h-5 stroke-[2.2]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'studygroups' ? 'text-blue-700 font-extrabold' : 'text-slate-600'
        }`}>
          Study Groups
        </span>
      </button>

      {/* 3. Marketplace */}
      <button
        onClick={() => setCurrentTab('marketplace')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer relative ${
          currentTab === 'marketplace' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${
          currentTab === 'marketplace' ? 'bg-blue-100/90 text-blue-700 shadow-2xs' : ''
        }`}>
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'marketplace' ? 'text-blue-700 font-extrabold' : 'text-slate-600'
        }`}>
          Market
        </span>
      </button>

      {/* 4. AI Copilot */}
      <button
        onClick={() => setCurrentTab('copilot')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer relative ${
          currentTab === 'copilot' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${
          currentTab === 'copilot' ? 'bg-amber-100/90 text-amber-800 shadow-2xs' : ''
        }`}>
          <Sparkles className="w-5 h-5 stroke-[2.2] text-amber-500" />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'copilot' ? 'text-blue-700 font-extrabold' : 'text-slate-600'
        }`}>
          AI Copilot
        </span>
      </button>

      {/* 5. Profile & Data Management */}
      <button
        onClick={() => setCurrentTab('profile')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer relative ${
          currentTab === 'profile' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className={`p-0.5 rounded-full transition-all ring-2 ${
          currentTab === 'profile' ? 'ring-blue-600' : 'ring-transparent'
        }`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-6 h-6 rounded-full object-cover"
          />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
          currentTab === 'profile' ? 'text-blue-700 font-extrabold' : 'text-slate-600'
        }`}>
          Profile
        </span>
      </button>
    </nav>
  );
};
