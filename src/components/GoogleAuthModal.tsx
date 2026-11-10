import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  GraduationCap, 
  LogOut,
  ArrowRight
} from 'lucide-react';
import { StudentProfile } from '../types';
import { triggerConfetti } from '../utils/helpers';
import { signInWithGoogle, syncUserProfile, logOut } from '../firebase';

interface GoogleAuthModalProps {
  currentUser: StudentProfile;
  setCurrentUser: (user: StudentProfile) => void;
  onClose: () => void;
  onOpenDataManagement: () => void;
  onRequireOnboarding?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  currentUser,
  setCurrentUser,
  onClose,
  onOpenDataManagement,
  onRequireOnboarding,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasRealAccount = Boolean(currentUser.id && currentUser.name && currentUser.school);

  const handleFirebaseSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        const synced = await syncUserProfile(fbUser, {});
        if (synced) {
          const profile: StudentProfile = {
            id: fbUser.uid,
            name: synced.displayName || fbUser.displayName || 'Campus Student',
            username: (fbUser.email || 'student').split('@')[0],
            avatar: synced.avatar || fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            college: synced.school || synced.college || '',
            school: synced.school || synced.college || '',
            country: synced.country || '',
            state: synced.state || '',
            currencyCode: synced.currencyCode || 'USD',
            currencySymbol: synced.currencySymbol || '$',
            major: synced.major || '',
            graduationYear: synced.graduationYear || '2026',
            karma: synced.karma || 50,
            badges: synced.badges || ['Verified Student', 'Google Authenticated'],
            verifiedStudent: true,
          };
          setCurrentUser(profile);
          localStorage.setItem('askcampus_user_v2', JSON.stringify(profile));
          localStorage.setItem('askcampus_entered', 'true');

          triggerConfetti();
          onClose();

          // Immediately ask user for their country, state, and school if not configured
          if (!profile.country || !profile.school) {
            if (onRequireOnboarding) {
              onRequireOnboarding();
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in popup was closed. Please try again to connect your Google account.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMessage('The sign-in popup was blocked by your browser. Please allow popups for this site and retry.');
      } else {
        setErrorMessage('Unable to connect with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOutAccount = async () => {
    await logOut();
    localStorage.removeItem('askcampus_user_v2');
    localStorage.removeItem('askcampus_entered');
    const emptyProfile: StudentProfile = {
      id: '',
      name: '',
      username: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      college: '',
      school: '',
      country: '',
      state: '',
      currencyCode: 'USD',
      currencySymbol: '$',
      major: '',
      graduationYear: '2026',
      karma: 0,
      badges: [],
      verifiedStudent: false,
    };
    setCurrentUser(emptyProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-3 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Top Header */}
        <div className="p-5 text-center relative border-b border-slate-100 bg-gradient-to-b from-blue-50/80 to-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Google "G" Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md mx-auto mb-3 flex items-center justify-center ring-1 ring-slate-200">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.26 21.34 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.38l4-3.13z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.66 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
          </div>

          <h3 className="text-lg font-black text-slate-900">
            {hasRealAccount ? 'Your Google Account' : 'Sign In with Google'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Authenticate first, then set up your country and school
          </p>
        </div>

        {/* Current Active Account Card (if already signed in) */}
        {hasRealAccount && (
          <div className="p-4 pb-0">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">
                    @{currentUser.username}
                  </div>
                  <div className="text-[10px] text-blue-700 font-semibold truncate">
                    {currentUser.school || 'Campus Member'}
                  </div>
                </div>
              </div>

              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <div className="flex gap-2 mt-2.5">
              <button
                onClick={handleSignOutAccount}
                className="flex-1 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
              {onRequireOnboarding && (
                <button
                  onClick={() => {
                    onClose();
                    onRequireOnboarding();
                  }}
                  className="flex-1 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-blue-200"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Update Campus</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Google Sign-In Action Button */}
        <div className="p-4 space-y-3">
          {errorMessage && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] leading-relaxed">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleFirebaseSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-black text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.26 21.34 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.38l4-3.13z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.66 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <span>{isLoading ? 'Connecting to Google...' : (hasRealAccount ? 'Switch Google Account' : 'Sign Up / Sign In with Google')}</span>
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed px-2">
            After signing in with Google, you will select your country and school to see local prices and classmates.
          </p>

          {/* Profile & Data Management Link */}
          {hasRealAccount && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onClose();
                  onOpenDataManagement();
                }}
                className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>User Profile & Badges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real Google student accounts only • 100% Secure</span>
        </div>
      </div>
    </div>
  );
};
