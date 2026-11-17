import React, { useState } from 'react';
import { 
  User, 
  Award, 
  ShoppingBag, 
  MessageSquare, 
  Heart, 
  Download, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Save, 
  HardDrive, 
  Database, 
  LogOut,
  MapPin,
  GraduationCap,
  Sparkles,
  Globe2,
  Users
} from 'lucide-react';
import { StudentProfile, Question, MarketplaceItem, Conversation } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { triggerConfetti, formatPrice } from '../utils/helpers';

interface UserProfileViewProps {
  currentUser: StudentProfile;
  setCurrentUser: (user: StudentProfile) => void;
  questions: Question[];
  marketplaceItems: MarketplaceItem[];
  conversations: Conversation[];
  registeredColleagues?: StudentProfile[];
  onOpenGoogleAuth: () => void;
  onSelectQuestion: (question: Question) => void;
  onSelectItem: (item: MarketplaceItem) => void;
  onResetData: () => void;
  onSignOut?: () => void;
  onOpenCampusSetup?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  setCurrentUser,
  questions,
  marketplaceItems,
  conversations,
  registeredColleagues = [],
  onOpenGoogleAuth,
  onSelectQuestion,
  onSelectItem,
  onResetData,
  onSignOut,
  onOpenCampusSetup,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'my_items' | 'edit' | 'data'>('overview');

  // Edit fields
  const [editName, setEditName] = useState(currentUser.name);
  const [editMajor, setEditMajor] = useState(currentUser.major);
  const [editCollege, setEditCollege] = useState(currentUser.school || currentUser.college);
  const [editYear, setEditYear] = useState(currentUser.graduationYear);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute stats
  const myQuestions = questions.filter((q) => q.author.id === currentUser.id);
  const myMarketplaceItems = marketplaceItems.filter((i) => i.seller.id === currentUser.id);
  const mySavedItems = marketplaceItems.filter((i) => i.isSaved);
  const currencySymbol = currentUser.currencySymbol || '$';

  // Real registered peers from user's school
  const schoolPeers = registeredColleagues.filter(
    (p) => p.id !== currentUser.id && (
      (p.school && p.school.toLowerCase() === (currentUser.school || currentUser.college || '').toLowerCase()) ||
      (p.college && p.college.toLowerCase() === (currentUser.school || currentUser.college || '').toLowerCase())
    )
  );

  // Calculate local storage size
  const storageSize = Math.round(
    (JSON.stringify(questions).length +
     JSON.stringify(marketplaceItems).length +
     JSON.stringify(conversations).length) / 1024
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name: editName.trim(),
      major: editMajor.trim(),
      college: editCollege,
      school: editCollege,
      graduationYear: editYear.trim(),
    };
    setCurrentUser(updated);
    setSaveSuccess(true);
    triggerConfetti();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      userProfile: currentUser,
      myQuestions,
      myMarketplaceItems,
      myConversations: conversations.filter(
        (c) => c.buyer.id === currentUser.id || c.seller.id === currentUser.id
      ),
      wishlistItems: mySavedItems,
      appVersion: 'AskCampus v2.5.0-android',
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `askcampus-data-${currentUser.username}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerConfetti();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* Google User Header Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          {/* Background banner */}
          <div className="h-24 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 relative flex items-start justify-end p-3.5 gap-2">
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-rose-500/85 backdrop-blur-xs text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button
              onClick={onOpenGoogleAuth}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          </div>

          {/* Avatar & Karma */}
          <div className="relative flex items-end justify-between -mt-11 mb-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center ring-2 ring-blue-500">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.26 21.34 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.38l4-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.66 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold tabular-nums">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentUser.karma.toLocaleString()} Karma</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {currentUser.name}
              </h2>
              <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200/70 font-semibold">
                Google Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.username}@gmail.com
            </p>

            {/* Unboxed Clean Academic & Locale Metadata */}
            <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 text-slate-900 font-semibold">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{currentUser.school || currentUser.college}</span>
              </span>

              {currentUser.country && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 text-slate-700">
                    <Globe2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{currentUser.state ? `${currentUser.state}, ` : ''}{currentUser.country}</span>
                  </span>
                </>
              )}

              <span className="text-slate-300">·</span>
              <span className="text-blue-700 font-medium">{currentUser.major}</span>

              <span className="text-slate-300">·</span>
              <span className="text-slate-500 tabular-nums">Class of {currentUser.graduationYear}</span>

              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 font-semibold">
                Currency: {currencySymbol} ({currentUser.currencyCode || 'USD'})
              </span>
            </div>

            {onOpenCampusSetup && (
              <div className="mt-4">
                <button
                  onClick={onOpenCampusSetup}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Change Country, School & Currency</span>
                </button>
              </div>
            )}

            {/* Badges */}
            {currentUser.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                {currentUser.badges.map((badge) => (
                  <span
                    key={badge}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    ★ {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-200/75 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'overview' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveSubTab('my_items')}
            className={`py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'my_items' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setActiveSubTab('edit')}
            className={`py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'edit' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveSubTab('data')}
            className={`py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'data' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Mgmt
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeSubTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 text-center">
                <div className="text-2xl font-extrabold text-blue-600 tabular-nums">{myQuestions.length}</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Questions</div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 text-center">
                <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">{myMarketplaceItems.length}</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Listings</div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 text-center">
                <div className="text-2xl font-extrabold text-rose-500 tabular-nums">{mySavedItems.length}</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Wishlist</div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 text-center">
                <div className="text-2xl font-extrabold text-amber-500 tabular-nums">{currentUser.karma}</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Karma PTS</div>
              </div>
            </div>

            {/* Quick Security & Google Sync status */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Google Sync Active</div>
                  <div className="text-[11px] text-slate-500">Connected with Google Identity</div>
                </div>
              </div>
              <button
                onClick={onOpenGoogleAuth}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Manage
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MY POSTS (QUESTIONS & LISTINGS) */}
        {activeSubTab === 'my_items' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                My Active Marketplace Materials ({myMarketplaceItems.length})
              </h3>
              {myMarketplaceItems.length === 0 ? (
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center text-xs text-slate-500">
                  You haven't listed any textbooks or supplies yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myMarketplaceItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={item.images[0]} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-blue-600 font-semibold tabular-nums mt-0.5">
                            {formatPrice(item.price, item.currencySymbol || currencySymbol)} · {item.condition}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 capitalize shrink-0">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                My Academic Questions ({myQuestions.length})
              </h3>
              {myQuestions.length === 0 ? (
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center text-xs text-slate-500">
                  You haven't asked any questions yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myQuestions.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => onSelectQuestion(q)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          {q.courseCode}
                        </span>
                        <span className="text-[11px] text-slate-400">{q.createdAt}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">{q.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registered Campus Colleagues */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Colleagues from {currentUser.school || currentUser.college || 'My Campus'}</span>
                <span className="text-[11px] text-blue-600 lowercase font-semibold tabular-nums">{schoolPeers.length} registered</span>
              </h3>
              {schoolPeers.length === 0 ? (
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-center text-xs text-slate-500">
                  No other students from {currentUser.school || 'your campus'} have registered an account yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {schoolPeers.map((peer) => (
                    <div key={peer.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3">
                      <img src={peer.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{peer.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{peer.major} · {peer.school || peer.college}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeSubTab === 'edit' && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Student Profile</h3>
              {saveSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">University Campus</label>
              <select
                value={editCollege}
                onChange={(e) => setEditCollege(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {UNIVERSITIES.filter((u) => u !== 'All Campuses').map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Major / Degree</label>
                <input
                  type="text"
                  value={editMajor}
                  onChange={(e) => setEditMajor(e.target.value)}
                  required
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Graduation Year</label>
                <input
                  type="text"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  required
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 tabular-nums"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {/* TAB 4: DATA MANAGEMENT & PRIVACY */}
        {activeSubTab === 'data' && (
          <div className="space-y-4">
            {/* Storage Stats */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-3.5">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <Database className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Data Management & Storage</h3>
              </div>

              <div className="text-xs text-slate-600 space-y-2.5">
                <div className="flex justify-between">
                  <span>Cached Data Size:</span>
                  <span className="font-bold text-slate-900 tabular-nums">~{storageSize} KB</span>
                </div>
                <div className="flex justify-between">
                  <span>Stored Questions:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{questions.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketplace Items:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{marketplaceItems.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Messages:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{conversations.length} threads</span>
                </div>
              </div>

              {/* Export Button */}
              <div className="pt-2">
                <button
                  onClick={handleExportData}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export My Data (JSON Backup)</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-1.5">
                  Download a complete copy of all your questions, offers, and listings.
                </p>
              </div>
            </div>

            {/* Reset & Wipe Options */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Storage Control & Reset
              </h4>

              <button
                onClick={() => {
                  if (window.confirm('Reset all demo questions and marketplace items to initial seed?')) {
                    onResetData();
                    triggerConfetti();
                  }
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default Campus Data</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your saved profile data?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local Storage Cache</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
