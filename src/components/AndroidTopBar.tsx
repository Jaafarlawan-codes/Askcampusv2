import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  MessageCircle, 
  ChevronDown, 
  X,
  Bookmark,
  Users,
  Globe2,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { SUPPORTED_COUNTRIES } from '../data/campusLocations';

interface AndroidTopBarProps {
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  currentUser: StudentProfile;
  onOpenGoogleAuth: () => void;
  onOpenMessages: () => void;
  onOpenSaved: () => void;
  unreadCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectTab: (tab: any) => void;
  onOpenWelcome?: () => void;
  onOpenCampusSetup?: () => void;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  selectedCampus,
  setSelectedCampus,
  currentUser,
  onOpenGoogleAuth,
  onOpenMessages,
  onOpenSaved,
  unreadCount,
  searchQuery,
  setSearchQuery,
  onSelectTab,
  onOpenWelcome,
  onOpenCampusSetup,
}) => {
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Find country flag
  const matchedCountry = SUPPORTED_COUNTRIES.find(
    (c) => c.name.toLowerCase() === (currentUser.country || '').toLowerCase()
  );
  const countryFlag = matchedCountry?.flag || '🎓';

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-900 px-4 sm:px-6 py-2.5 border-b border-slate-200/90 shadow-2xs shrink-0 z-30 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Campus Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onOpenWelcome}
            className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="AskCampus Home"
          >
            <img
              src="/assets/aistudio/file_000000006df08210b3718ff8855bd0e3_7e7e3969.png"
              alt="AskCampus Logo"
              className="w-8 h-8 rounded-xl shadow-2xs object-cover ring-1 ring-slate-200/80"
            />
            <div className="leading-tight hidden sm:block">
              <span className="text-base font-extrabold tracking-tight text-slate-900 block">
                Ask<span className="text-blue-600">Campus</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">
                {currentUser.currencyCode ? `${currentUser.currencySymbol} ${currentUser.currencyCode}` : 'Student Network'}
              </span>
            </div>
          </button>

          {/* Campus Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowCampusDropdown(!showCampusDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-bold text-slate-800 transition-all cursor-pointer max-w-[150px] sm:max-w-[220px] truncate"
              title="Click to switch campus or update location"
            >
              <span className="shrink-0 text-sm">{countryFlag}</span>
              <span className="truncate">{selectedCampus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-0.5" />
            </button>

            {showCampusDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowCampusDropdown(false)} 
                />
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Campus Network</span>
                    {currentUser.school && (
                      <span className="text-blue-600 font-bold lowercase">my school</span>
                    )}
                  </div>

                  {/* Option: My School Colleagues */}
                  {currentUser.school && (
                    <button
                      onClick={() => {
                        setSelectedCampus(currentUser.school);
                        setShowCampusDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedCampus === currentUser.school ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm">{countryFlag}</span>
                        <span className="truncate">{currentUser.school} (My School)</span>
                      </div>
                      {selectedCampus === currentUser.school && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </button>
                  )}

                  {/* All Campuses option */}
                  <button
                    onClick={() => {
                      setSelectedCampus('All Campuses');
                      setShowCampusDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedCampus === 'All Campuses' ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>All Campuses (Global)</span>
                    </div>
                    {selectedCampus === 'All Campuses' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </button>

                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 mt-1">
                    Popular Universities
                  </div>

                  {UNIVERSITIES.filter((u) => u !== 'All Campuses' && u !== currentUser.school).slice(0, 5).map((campus) => (
                    <button
                      key={campus}
                      onClick={() => {
                        setSelectedCampus(campus);
                        setShowCampusDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedCampus === campus ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-slate-600'
                      }`}
                    >
                      <span className="truncate">{campus}</span>
                      {selectedCampus === campus && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}

                  {/* Button to re-open Country / School Setup */}
                  {onOpenCampusSetup && (
                    <div className="pt-2 mt-1 border-t border-slate-100 px-2.5">
                      <button
                        onClick={() => {
                          setShowCampusDropdown(false);
                          onOpenCampusSetup();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Update Country & Campus</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Desktop Inline Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, course codes, textbooks, study groups..."
            className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs font-medium text-slate-900 pl-9 pr-8 py-2 rounded-xl border border-slate-200/90 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Action Icons: Search (mobile), Messages, Google Account */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Messages button */}
          <button
            onClick={onOpenMessages}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            title="Messages & Chats"
          >
            <MessageCircle className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile & Google Auth avatar trigger */}
          <button
            onClick={onOpenGoogleAuth}
            className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer relative"
            title="Google Account & Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-2xs border border-slate-100">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.26 21.34 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.38l4-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.66 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Expandable Search Input (Mobile Only) */}
      {showSearchInput && (
        <div className="md:hidden mt-2.5 relative animate-in fade-in duration-100">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, course codes, materials..."
            className="w-full bg-slate-100 text-xs font-medium text-slate-900 pl-9 pr-8 py-2 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </header>
  );
};
