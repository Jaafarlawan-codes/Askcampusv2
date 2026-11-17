import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  Plus, 
  MapPin, 
  Award, 
  ChevronDown,
  MessageCircle,
  Bookmark,
  X,
  LogOut,
  User,
  Globe2
} from 'lucide-react';
import { StudentProfile } from '../types';
import { UNIVERSITIES } from '../data/mockData';

interface NavbarProps {
  currentTab: 'questions' | 'marketplace' | 'studygroups' | 'copilot' | 'saved' | 'profile';
  setCurrentTab: (tab: any) => void;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  currentUser: StudentProfile;
  setCurrentUser: (user: StudentProfile) => void;
  onOpenAskModal: () => void;
  onOpenSellModal: () => void;
  onOpenMessages: () => void;
  unreadMessagesCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenGoogleAuth?: () => void;
  onOpenCampusSetup?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedCampus,
  setSelectedCampus,
  currentUser,
  setCurrentUser,
  onOpenAskModal,
  onOpenSellModal,
  onOpenMessages,
  unreadMessagesCount,
  searchQuery,
  setSearchQuery,
  onOpenGoogleAuth,
  onOpenCampusSetup,
  onSignOut,
}) => {
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg border-b border-blue-500/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Campus Selector */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setCurrentTab('questions')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <img
                src="/assets/aistudio/file_000000006df08210b3718ff8855bd0e3_7e7e3969.png"
                alt="AskCampus Logo"
                className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform shrink-0 object-cover ring-2 ring-white/20"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-black tracking-tight text-white">
                  Ask<span className="text-amber-300">Campus</span>
                </span>
                <span className="block text-[10px] font-bold tracking-wider text-sky-100 opacity-90">
                  Ask. Answer. Connect.
                </span>
              </div>
            </button>

            {/* Campus Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 border border-blue-400/40 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs backdrop-blur-xs"
                title="Filter by university campus"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[150px]">{selectedCampus}</span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              </button>

              {showCampusDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowCampusDropdown(false)} 
                  />
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      Select University
                    </div>
                    {UNIVERSITIES.map((campus) => (
                      <button
                        key={campus}
                        onClick={() => {
                          setSelectedCampus(campus);
                          setShowCampusDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-600/20 hover:text-white transition-colors cursor-pointer ${
                          selectedCampus === campus ? 'text-indigo-400 font-semibold bg-indigo-950/40' : 'text-slate-300'
                        }`}
                      >
                        <span>{campus}</span>
                        {selectedCampus === campus && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  currentTab === 'marketplace'
                    ? "Search textbooks, calculators, course code (e.g., MATH 51)..."
                    : "Search questions, courses, formulas (e.g., CS 161, Dijkstra)..."
                }
                className="w-full bg-blue-800/50 text-sm text-white pl-10 pr-9 py-2 rounded-xl border border-blue-400/40 placeholder:text-blue-200/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setCurrentTab('questions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'questions'
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/40'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>Q&A Hub</span>
            </button>

            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'marketplace'
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/40'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Marketplace</span>
              <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-900">
                Thrift
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('studygroups')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'studygroups'
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/40'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Study Groups</span>
            </button>

            <button
              onClick={() => setCurrentTab('copilot')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'copilot'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
          </nav>

          {/* Action Buttons & Profile Switcher */}
          <div className="flex items-center gap-2">
            {/* Quick Messages */}
            <button
              onClick={onOpenMessages}
              className="relative p-2 rounded-xl bg-blue-800/60 hover:bg-blue-800 border border-blue-400/40 text-white transition-colors cursor-pointer shadow-xs"
              title="Marketplace Chats & Offers"
            >
              <MessageCircle className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Saved */}
            <button
              onClick={() => setCurrentTab('saved')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                currentTab === 'saved'
                  ? 'bg-white text-blue-700 border-white shadow-xs'
                  : 'bg-blue-800/60 hover:bg-blue-800 text-blue-100 hover:text-white border-blue-400/40'
              }`}
              title="Saved Questions & Items"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Primary Action Button (contextual) */}
            {currentTab === 'marketplace' ? (
              <button
                onClick={onOpenSellModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Sell Material</span>
              </button>
            ) : (
              <button
                onClick={onOpenAskModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Ask Question</span>
              </button>
            )}

            {/* Profile Dropdown & Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer group"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-400"
                />
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-semibold text-slate-200 leading-tight group-hover:text-white">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 flex items-center gap-0.5">
                    <Award className="w-3 h-3" />
                    <span>{currentUser.karma.toLocaleString()} karma</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-200">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate text-sm">
                          {currentUser.name}
                        </div>
                        <div className="text-xs text-indigo-300 truncate">
                          {currentUser.major}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {currentUser.college} • Class of {currentUser.graduationYear}
                        </div>
                      </div>
                    </div>

                    <div className="py-2.5 flex items-center justify-between text-xs bg-slate-800/50 rounded-xl px-3 my-2 border border-slate-700/50">
                      <span className="text-slate-400">Campus Reputation:</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {currentUser.karma.toLocaleString()} Karma
                      </span>
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setCurrentTab('profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        <span>View My Profile</span>
                      </button>

                      {onOpenCampusSetup && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onOpenCampusSetup();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                        >
                          <Globe2 className="w-4 h-4 text-emerald-400" />
                          <span>Campus & Currency Settings</span>
                        </button>
                      )}

                      {currentUser.name && onSignOut ? (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onSignOut();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-rose-950/40 text-rose-300 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign Out</span>
                        </button>
                      ) : onOpenGoogleAuth ? (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onOpenGoogleAuth();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-blue-600/30 text-blue-300 font-bold transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-blue-400" />
                          <span>Sign In / Create Account</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentTab === 'marketplace'
                  ? "Search textbooks, calculators, supplies..."
                  : "Search questions & course codes..."
              }
              className="w-full bg-slate-800 text-xs text-slate-100 pl-9 pr-8 py-2 rounded-xl border border-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
