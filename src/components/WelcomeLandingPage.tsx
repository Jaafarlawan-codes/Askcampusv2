import React from 'react';
import { 
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  ShoppingBag,
  Users,
  MessageSquare,
  Globe2,
  CheckCircle2
} from 'lucide-react';

interface WelcomeLandingPageProps {
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  onGetStarted: () => void;
  onSignInGoogle: () => void;
  onContinueGuest: () => void;
  onExploreMarketplace: () => void;
}

export const WelcomeLandingPage: React.FC<WelcomeLandingPageProps> = ({
  selectedCampus,
  setSelectedCampus,
  onGetStarted,
  onSignInGoogle,
  onContinueGuest,
  onExploreMarketplace,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* 3-Zone Top Bar */}
      <header className="px-5 sm:px-8 py-4 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/assets/aistudio/file_000000006df08210b3718ff8855bd0e3_7e7e3969.png"
              alt="AskCampus Logo"
              className="w-8 h-8 rounded-xl shadow-md object-cover ring-1 ring-white/10"
            />
            <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
              Ask<span className="text-blue-400">Campus</span>
            </span>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="whitespace-nowrap">Academic Q&A</span>
            <span className="whitespace-nowrap">Study Groups</span>
            <span className="whitespace-nowrap">Campus Marketplace</span>
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onSignInGoogle}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Clean Hero */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 flex-1 flex flex-col justify-center w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold text-blue-400 tracking-wide mb-3">
            Colleague Network for University Students
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-5 text-balance">
            Your campus is full of people who know something you don't.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8 max-w-xl mx-auto">
            Connect with verified classmates at your school. Ask course questions, organize study groups, and exchange textbooks in your local currency.
          </p>

          {/* Primary Action CTA */}
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={onSignInGoogle}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group whitespace-nowrap"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z" opacity="0.95"/>
                <path fill="#FFFFFF" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.26 21.34 7.33 24 12 24z" opacity="0.9"/>
                <path fill="#FFFFFF" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.38l4-3.13z" opacity="0.85"/>
                <path fill="#FFFFFF" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.66 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z" opacity="0.95"/>
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <p className="text-xs text-slate-400">
              Sign in with Google first, then set your country, school, and local currency.
            </p>
          </div>
        </div>

        {/* Clean 3 Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white mb-2">
                Colleague Q&A
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ask questions tagged with your course code and get answers from classmates and verified TAs at your campus.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white mb-2">
                Study Groups
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Find or host midterm and exam prep sessions with fellow students in your library or online.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white mb-2">
                Campus Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Exchange textbooks, lab gear, and calculators in your local currency with direct transfers and verified receipts.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="px-5 sm:px-8 py-5 border-t border-slate-800/80 text-center text-xs text-slate-500">
        AskCampus · Student-to-student academic network
      </footer>
    </div>
  );
};
