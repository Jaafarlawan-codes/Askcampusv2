import React from 'react';
import { 
  ArrowRight,
  ShoppingBag,
  Users,
  MessageSquare,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import {
  QA_CATEGORY_ROUTES,
  MARKETPLACE_CATEGORY_ROUTES,
  ParsedAppRoute,
} from '../data/seoRoutes';

interface WelcomeLandingPageProps {
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  onGetStarted: () => void;
  onSignInGoogle: () => void;
  onContinueGuest: () => void;
  onExploreMarketplace: () => void;
  activeRoute?: ParsedAppRoute;
  onNavigateRoute?: (path: string) => void;
}

export const WelcomeLandingPage: React.FC<WelcomeLandingPageProps> = ({
  onSignInGoogle,
  activeRoute,
  onNavigateRoute,
}) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigateRoute) {
      e.preventDefault();
      onNavigateRoute(path);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* 3-Zone Top Bar */}
      <header className="px-5 sm:px-8 py-4 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Brand wordmark */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <img
              src="/icon-192x192.png"
              alt="AskCampus Logo"
              className="w-8 h-8 rounded-xl shadow-md object-cover ring-1 ring-white/10"
            />
            <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
              Ask<span className="text-blue-400">Campus</span>
            </span>
          </a>

          {/* Zone 2: Semantic single-line navigation links */}
          <nav aria-label="Primary Sections" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a
              href="/qa"
              onClick={(e) => handleLinkClick(e, '/qa')}
              className={`whitespace-nowrap hover:text-white transition-colors ${
                activeRoute?.canonicalPath.startsWith('/qa') ? 'text-white font-semibold' : ''
              }`}
            >
              Academic Q&amp;A
            </a>
            <a
              href="/study-groups"
              onClick={(e) => handleLinkClick(e, '/study-groups')}
              className={`whitespace-nowrap hover:text-white transition-colors ${
                activeRoute?.canonicalPath === '/study-groups' ? 'text-white font-semibold' : ''
              }`}
            >
              Study Groups
            </a>
            <a
              href="/marketplace"
              onClick={(e) => handleLinkClick(e, '/marketplace')}
              className={`whitespace-nowrap hover:text-white transition-colors ${
                activeRoute?.canonicalPath.startsWith('/marketplace') ? 'text-white font-semibold' : ''
              }`}
            >
              Campus Marketplace
            </a>
            <a
              href="/ai-copilot"
              onClick={(e) => handleLinkClick(e, '/ai-copilot')}
              className={`whitespace-nowrap hover:text-white transition-colors ${
                activeRoute?.canonicalPath === '/ai-copilot' ? 'text-white font-semibold' : ''
              }`}
            >
              AI Copilot
            </a>
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

      {/* Main Clean Hero & Organized Directory */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 flex-1 flex flex-col justify-center w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold text-blue-400 tracking-wide mb-3">
            {activeRoute?.activeLabel
              ? `${activeRoute.activeLabel} · AskCampus Student App`
              : 'University Student App & Colleague Network'}
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-5 text-balance">
            {activeRoute?.activeLabel
              ? `${activeRoute.activeLabel} on AskCampus`
              : "Your campus is full of people who know something you don't."}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8 max-w-xl mx-auto">
            {activeRoute?.activeLabel
              ? activeRoute.seoDescription
              : 'Connect with verified classmates at your school. Ask course questions, organize study groups, and exchange textbooks in your local currency.'}
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
              <span>
                {activeRoute?.activeLabel
                  ? `Continue with Google for ${activeRoute.activeLabel}`
                  : 'Continue with Google'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <p className="text-xs text-slate-400">
              Sign in with Google first, then set your country, school, and local currency.
            </p>
          </div>
        </div>

        {/* Core Platform Sections */}
        <section aria-label="Core Features" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10">
          <a
            href="/qa"
            onClick={(e) => handleLinkClick(e, '/qa')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 text-left flex flex-col justify-between transition-colors group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Colleague Q&amp;A</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ask questions tagged with your course code and get answers from classmates and verified TAs at your campus.
              </p>
            </div>
          </a>

          <a
            href="/study-groups"
            onClick={(e) => handleLinkClick(e, '/study-groups')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left flex flex-col justify-between transition-colors group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Study Groups</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Find or host midterm and exam prep sessions with fellow students in your library or online.
              </p>
            </div>
          </a>

          <a
            href="/marketplace"
            onClick={(e) => handleLinkClick(e, '/marketplace')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-left flex flex-col justify-between transition-colors group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Campus Marketplace</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Exchange textbooks, lab gear, and calculators in your local currency with direct transfers and verified receipts.
              </p>
            </div>
          </a>
        </section>

        {/* Organized Google-Indexed Category Directory */}
        <section aria-label="Organized Campus Categories" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Academic Q&A Subject Categories */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Academic Q&amp;A Subjects</h2>
                  <p className="text-[11px] text-slate-400">Course discussions organized by discipline</p>
                </div>
              </div>
              <a
                href="/qa"
                onClick={(e) => handleLinkClick(e, '/qa')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap"
              >
                All Subjects
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QA_CATEGORY_ROUTES.map((cat) => {
                const isActive = activeRoute?.canonicalPath === cat.path;
                return (
                  <a
                    key={cat.slug}
                    href={cat.path}
                    onClick={(e) => handleLinkClick(e, cat.path)}
                    className={`p-3 rounded-xl border transition-colors block ${
                      isActive
                        ? 'bg-blue-600/20 border-blue-500/70 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{cat.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cat.subtitle}</div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Campus Marketplace Categories */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Marketplace Categories</h2>
                    <p className="text-[11px] text-slate-400">Textbooks, tech &amp; supplies in local currency</p>
                  </div>
                </div>
                <a
                  href="/marketplace"
                  onClick={(e) => handleLinkClick(e, '/marketplace')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 whitespace-nowrap"
                >
                  All Items
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MARKETPLACE_CATEGORY_ROUTES.map((cat) => {
                  const isActive = activeRoute?.canonicalPath === cat.path;
                  return (
                    <a
                      key={cat.slug}
                      href={cat.path}
                      onClick={(e) => handleLinkClick(e, cat.path)}
                      className={`p-3 rounded-xl border transition-colors block ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-400/70 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{cat.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cat.subtitle}</div>
                    </a>
                  );
                })}
              </div>
            </div>

            <a
              href="/ai-copilot"
              onClick={(e) => handleLinkClick(e, '/ai-copilot')}
              className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">AI Study Copilot &amp; Price Advisor</div>
                  <div className="text-[11px] text-slate-400">Concept breakdowns, practice quizzes &amp; textbook appraisals</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </a>
          </div>
        </section>

        {/* Frequently Asked Questions for Students & Search Crawlers */}
        <section aria-label="Frequently Asked Questions" className="mt-10 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6">
          <h2 className="text-sm font-bold text-white mb-4">How AskCampus Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs leading-relaxed">
            <div>
              <h3 className="font-semibold text-slate-100 mb-1">Campus-Scoped Q&amp;A</h3>
              <p className="text-slate-400">
                Sign in with Google, pick your university, and ask course-coded questions answered by peers and teaching assistants in your classes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 mb-1">Reputation-Ranked Marketplace</h3>
              <p className="text-slate-400">
                Exchange textbooks, calculators, and lab gear in your local currency. Buyers rate sellers 1–5 stars so top-reputation sellers are recommended first.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 mb-1">Direct Transfers &amp; Safe Meetups</h3>
              <p className="text-slate-400">
                Pay zero marketplace commission—upload transfer receipts for seller confirmation and exchange items at safe public spots on campus.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Semantic Footer */}
      <footer className="px-5 sm:px-8 py-6 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>AskCampus · Student-to-student academic network</span>
          <nav aria-label="Footer Sitemap Links" className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <a href="/qa" onClick={(e) => handleLinkClick(e, '/qa')} className="hover:text-white transition-colors">Q&amp;A</a>
            <a href="/marketplace" onClick={(e) => handleLinkClick(e, '/marketplace')} className="hover:text-white transition-colors">Marketplace</a>
            <a href="/study-groups" onClick={(e) => handleLinkClick(e, '/study-groups')} className="hover:text-white transition-colors">Study Groups</a>
            <a href="/ai-copilot" onClick={(e) => handleLinkClick(e, '/ai-copilot')} className="hover:text-white transition-colors">AI Copilot</a>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};
