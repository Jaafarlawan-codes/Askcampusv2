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
    <div className="bg-slate-900 text-white px-3.5 sm:px-6 py-2.5 border-b border-slate-800 shadow-sm shrink-0 z-30 sticky top-0">
      <div className="max-w-7xl mx-auto">
        {/* Main Top Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <button 
            onClick={onOpenWelcome}
            className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="AskCampus Home"
          >
            <img
              src="/assets/aistudio/file_000000006df08210b3718ff8855bd0e3_7e7e3969.png"
              alt="AskCampus Logo"
              className="w-8 h-8 rounded-lg shadow-xs object-cover ring-1 ring-white/10"
            />
            <div className="leading-tight">
              <span className="text-base font-black tracking-tight text-white block">
                Ask<span className="text-blue-400">Campus</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-400 -mt-0.5 block tracking-wider uppercase">
                {currentUser.currencyCode ? `${currentUser.currencySymbol} • ${currentUser.currencyCode}` : 'Ask. Answer. Connect.'}
              </span>
            </div>
          </button>

          {/* Campus & School Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowCampusDropdown(!showCampusDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer max-w-[170px] sm:max-w-[240px] truncate"
              title="Click to switch campus or update location"
            >
              <span className="shrink-0 text-sm">{countryFlag}</span>
              <span className="truncate">{selectedCampus}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
            </button>

            {showCampusDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowCampusDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                    <span>Campus Network</span>
                    {currentUser.school && (
                      <span className="text-blue-400 font-bold lowercase">my school</span>
                    )}
                  </div>

                  {/* Option: My School Colleagues */}
                  {currentUser.school && (
                    <button
                      onClick={() => {
                        setSelectedCampus(currentUser.school);
                        setShowCampusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                        selectedCampus === currentUser.school ? 'text-blue-400 font-bold bg-slate-800/60' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-sm">{countryFlag}</span>
                        <span className="truncate">{currentUser.school} (My School)</span>
                      </div>
                      {selectedCampus === currentUser.school && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      )}
                    </button>
                  )}

                  {/* All Campuses option */}
                  <button
                    onClick={() => {
                      setSelectedCampus('All Campuses');
                      setShowCampusDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                      selectedCampus === 'All Campuses' ? 'text-blue-400 font-bold bg-slate-800/60' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>All Campuses (Global)</span>
                    </div>
                    {selectedCampus === 'All Campuses' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    )}
                  </button>

                  <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-800 mt-1">
                    Other Campuses
                  </div>

                  {UNIVERSITIES.filter((u) => u !== 'All Campuses' && u !== currentUser.school).slice(0, 5).map((campus) => (
                    <button
                      key={campus}
                      onClick={() => {
                        setSelectedCampus(campus);
                        setShowCampusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                        selectedCampus === campus ? 'text-blue-400 font-bold bg-slate-800/60' : 'text-slate-400'
                      }`}
                    >
                      <span className="truncate">{campus}</span>
                      {selectedCampus === campus && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      )}
                    </button>
                  ))}

                  {/* Button to re-open Country / School Setup */}
                  {onOpenCampusSetup && (
                    <div className="pt-1.5 mt-1 border-t border-slate-800 px-2">
                      <button
                        onClick={() => {
                          setShowCampusDropdown(false);
                          onOpenCampusSetup();
                        }}
                        className="w-full py-1.5 px-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Change Country & School</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Action Icons: Search, Messages, Google Account */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenMessages}
              className="relative p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Messages"
            >
              <MessageCircle className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={onOpenGoogleAuth}
              className="p-0.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer relative"
              title="Google Account & Profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-600"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white flex items-center justify-center shadow-xs">
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

        {/* Expandable Search Input */}
        {showSearchInput && (
          <div className="mt-2 relative animate-in fade-in duration-100">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, course codes, study materials..."
              className="w-full bg-slate-800 text-xs text-white pl-8 pr-7 py-2 rounded-xl border border-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              autoFocus
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
        )}
      </div>
    </div>
  );
};
