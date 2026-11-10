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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Sleek Minimal Header */}
      <header className="px-5 sm:px-10 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/file_000000006df08210b3718ff8855bd0e3_7e7e3969.png"
            alt="AskCampus Logo"
            className="w-9 h-9 rounded-xl shadow-md object-cover ring-1 ring-white/10"
          />
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-white">
              Ask<span className="text-blue-400">Campus</span>
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Student Community Network
            </span>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSignInGoogle}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Clean Hero */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-16 flex-1 flex flex-col justify-center w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/80 text-xs font-semibold text-blue-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Colleague Network for College Students</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15] mb-5">
            Your campus is full of people who know something you don't.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
            Connect with verified classmates at your school. Ask questions, join study groups, and exchange textbooks & student materials with direct P2P transfer in your local currency.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
            <button
              onClick={onSignInGoogle}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-102"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.87c2.26-2.09 3.67-5.17 3.67-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.13C3.26 21.34 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.62H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.38l4-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.66 1.27 6.62l4 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Sign Up / Sign In with Google</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Sign in with Google first, then set up your country, school, and local currency in 30 seconds.
          </p>
        </div>

        {/* Clean 3 Feature Highlights (Calm, Minimalist, No clutter) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Colleague Q&A & Answers
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask questions tagged with your exact course code and get insights from students and verified TAs from your campus.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Campus Study Groups
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find or create midterms and finals study sessions with peers at your university library or campus lounges.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Campus Thrift Marketplace
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exchange textbooks, lab coats, and calculators in your country's currency with direct seller transfers and receipts.
            </p>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="px-5 sm:px-10 py-5 border-t border-slate-800/80 text-center text-xs text-slate-500">
        AskCampus • Student-to-student community network
      </footer>
    </div>
  );
};
