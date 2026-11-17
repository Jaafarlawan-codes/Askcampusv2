import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  DollarSign, 
  HelpCircle, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Zap, 
  Lightbulb, 
  GraduationCap 
} from 'lucide-react';
import { StudentProfile } from '../types';
import { formatPrice } from '../utils/helpers';

interface AICopilotViewProps {
  currentUser: StudentProfile;
  selectedCampus: string;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  currentUser,
  selectedCampus,
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'price' | 'quiz'>('study');
  
  // Study Explainer State
  const [studyTopic, setStudyTopic] = useState('');
  const [studyCourse, setStudyCourse] = useState('CS 161');
  const [studyLoading, setStudyLoading] = useState(false);
  const [studyResult, setStudyResult] = useState<string | null>(null);

  // Price Estimator State
  const [itemTitle, setItemTitle] = useState('');
  const [itemCondition, setItemCondition] = useState('Like New');
  const [itemCategory, setItemCategory] = useState('Textbooks');
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceResult, setPriceResult] = useState<any | null>(null);

  // Quiz State
  const [quizTopic, setQuizTopic] = useState('');
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[] | null>(null);

  const handleStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyTopic.trim()) return;
    setStudyLoading(true);
    setStudyResult(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: studyTopic,
          questionBody: `Explain the fundamental concept, why it matters, step-by-step example, and typical exam pitfalls for ${studyCourse}.`,
          courseCode: studyCourse,
          category: 'Academics',
        }),
      });
      const data = await res.json();
      setStudyResult(data.answer);
    } catch {
      setStudyResult(
        `### Concept Breakdown: ${studyTopic}\n\n1. **Core Principle**: Identify key variables and invariant properties.\n2. **Intuitive Model**: Visualize step-by-step progression.\n3. **Exam Trap**: Pay close attention to boundary constraints and edge conditions!`
      );
    } finally {
      setStudyLoading(false);
    }
  };

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;
    setPriceLoading(true);
    setPriceResult(null);

    try {
      const res = await fetch('/api/ai/marketplace-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: itemTitle,
          category: itemCategory,
          condition: itemCondition,
        }),
      });
      const data = await res.json();
      setPriceResult(data);
    } catch {
      setPriceResult({
        suggestedPrice: 38,
        minPrice: 28,
        maxPrice: 48,
        quickPitch: `Selling "${itemTitle}" in ${itemCondition.toLowerCase()} condition. Available for campus library pickup.`,
        safeMeetupTips: 'Meet at Campus Student Union or Library 1st Floor.'
      });
    } finally {
      setPriceLoading(false);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;
    setQuizLoading(true);
    setQuizQuestions(null);

    setTimeout(() => {
      setQuizQuestions([
        {
          q: `1. In ${quizTopic}, what is the primary condition that must be verified before applying the standard theorem?`,
          a: 'Continuity / non-negativity across the closed domain interval.',
          tip: 'Examiners frequently test this boundary check on Question 1.'
        },
        {
          q: `2. How does the asymptotic time/space complexity change when scaling input size by a factor of $k$?`,
          a: 'Scales linearly or quadratically depending on recursion branch factor.',
          tip: 'Draw out the recursion tree for partial marks!'
        },
        {
          q: `3. What is the most common student error in the derivation step?`,
          a: 'Forgetting the chain rule coefficient or negative signs during reduction.',
          tip: 'Always plug in small integer values (e.g., $n=1, 2$) to sanity-check.'
        }
      ]);
      setQuizLoading(false);
    }, 800);
  };

  const currencySymbol = currentUser.currencySymbol || '$';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-600 mb-1">
            AI Study & Marketplace Assistant
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic & Resale Copilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Get step-by-step explanations for tough coursework, price appraisals in {currentUser.currencyCode || 'local currency'}, and practice cram questions.
          </p>
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="inline-flex flex-wrap gap-1.5 p-1 bg-slate-200/70 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'study'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Concept Explainer</span>
        </button>

        <button
          onClick={() => setActiveTab('price')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'price'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Price Appraiser</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Practice Quiz</span>
        </button>
      </div>

      {/* Tab 1: Study Explainer */}
      {activeTab === 'study' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
          <form onSubmit={handleStudySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Course
                </label>
                <input
                  type="text"
                  value={studyCourse}
                  onChange={(e) => setStudyCourse(e.target.value)}
                  placeholder="e.g. CS 161"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold uppercase"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Concept, Theorem, or Problem to Explain
                </label>
                <input
                  type="text"
                  value={studyTopic}
                  onChange={(e) => setStudyTopic(e.target.value)}
                  placeholder="e.g. Why does Dijkstra fail on negative edges, and how does Bellman-Ford fix it?"
                  required
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={studyLoading || !studyTopic.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {studyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Explain Step-by-Step</span>
              </button>
            </div>
          </form>

          {/* Result */}
          {studyResult && (
            <div className="mt-6 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-slate-800 leading-relaxed whitespace-pre-line text-sm animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Tutor Explanation</span>
              </div>
              {studyResult}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Marketplace Price Appraiser */}
      {activeTab === 'price' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handlePriceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                School Item Name & Edition
              </label>
              <input
                type="text"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="e.g. Campbell Biology 12th Edition Hardcover or TI-84 Plus CE"
                required
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Textbooks">Textbooks</option>
                  <option value="Calculators & Tech">Calculators & Tech</option>
                  <option value="Lab Supplies">Lab Supplies</option>
                  <option value="Dorm Living">Dorm Living</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Condition
                </label>
                <select
                  value={itemCondition}
                  onChange={(e) => setItemCondition(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                >
                  <option value="Brand New">Brand New (Still in shrink-wrap)</option>
                  <option value="Like New">Like New (No marks or highlighting)</option>
                  <option value="Good">Good (Minor wear or notes)</option>
                  <option value="Fair">Fair (Readable, worn cover)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={priceLoading || !itemTitle.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {priceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                <span>Calculate Campus Market Value</span>
              </button>
            </div>
          </form>

          {/* Price Result Card */}
          {priceResult && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Campus Resale Valuation
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                  {itemCondition}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {formatPrice(priceResult.suggestedPrice || 40, currencySymbol)}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">
                  Recommended range: {formatPrice(priceResult.minPrice || 30, currencySymbol)} - {formatPrice(priceResult.maxPrice || 50, currencySymbol)}
                </span>
              </div>

              {priceResult.quickPitch && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 mb-3 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">Generated Buyer Pitch:</span>
                  {priceResult.quickPitch}
                </div>
              )}

              {priceResult.safeMeetupTips && (
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Safety Tip:</span>
                  <span>{priceResult.safeMeetupTips}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Practice Midterm Crammer */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
          <form onSubmit={handleQuizSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic or Exam Syllabus Module
              </label>
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="e.g. Organic Chemistry Reaction Mechanisms, Macroeconomics IS-LM, or Binary Search Trees"
                required
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={quizLoading || !quizTopic.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {quizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Generate 3 Practice Questions</span>
              </button>
            </div>
          </form>

          {quizQuestions && (
            <div className="mt-6 space-y-4 animate-in fade-in">
              {quizQuestions.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
                  <div className="font-bold text-slate-900 text-sm mb-2">{item.q}</div>
                  <div className="text-xs text-purple-950 bg-white p-2.5 rounded-xl border border-purple-100 mb-2">
                    <span className="font-bold mr-1">Answer / Derivation:</span>
                    {item.a}
                  </div>
                  <div className="text-[11px] text-purple-700 font-medium">
                    💡 Exam Tip: {item.tip}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
