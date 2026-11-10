import React, { useState } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Bookmark, 
  Share2, 
  Code, 
  Bold, 
  Sigma, 
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Question, Answer, StudentProfile } from '../types';
import { getUrgencyBadge, triggerConfetti } from '../utils/helpers';

interface QuestionDetailModalProps {
  question: Question;
  currentUser: StudentProfile;
  onClose: () => void;
  onVoteQuestion: (questionId: string, direction: 'up' | 'down') => void;
  onVoteAnswer: (questionId: string, answerId: string, direction: 'up' | 'down') => void;
  onAcceptAnswer: (questionId: string, answerId: string) => void;
  onSubmitAnswer: (questionId: string, body: string) => void;
  onToggleBookmark: (questionId: string) => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question,
  currentUser,
  onClose,
  onVoteQuestion,
  onVoteAnswer,
  onAcceptAnswer,
  onSubmitAnswer,
  onToggleBookmark,
}) => {
  const [newAnswerText, setNewAnswerText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(question.aiExplanation || null);
  const [copiedLink, setCopiedLink] = useState(false);

  const urgencyInfo = getUrgencyBadge(question.urgency);
  const isAuthor = currentUser.id === question.author.id;

  const handleFetchAiExplanation = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: question.title,
          questionBody: question.body,
          courseCode: question.courseCode,
          category: question.category,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.answer);
    } catch (err) {
      setAiExplanation(
        `### Study Copilot Breakdown:\n- Check core definitions for ${question.courseCode}.\n- Formulate base assumptions and verify boundary limits.\n- Consult official lecture notes or ask during TA office hours.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerText.trim()) return;
    onSubmitAnswer(question.id, newAnswerText.trim());
    setNewAnswerText('');
    triggerConfetti();
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    setNewAnswerText((prev) => prev + `${prefix}text${suffix}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Sort answers: accepted first, then by upvotes desc
  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.upvotes - a.upvotes;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
              {question.courseCode}
            </span>
            <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {question.category}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              • {question.campus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(question.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                question.isBookmarked 
                  ? 'bg-amber-50 border-amber-200 text-amber-600' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${question.isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer relative"
              title="Share question"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Question Body */}
          <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
            {/* Voting Column */}
            <div className="flex flex-col items-center bg-slate-50 rounded-2xl p-2 border border-slate-200 shrink-0">
              <button
                onClick={() => onVoteQuestion(question.id, 'up')}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  question.userVote === 'up'
                    ? 'text-indigo-600 bg-indigo-100'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60'
                }`}
              >
                <ChevronUp className="w-6 h-6 stroke-[2.5]" />
              </button>
              <span className={`text-sm font-bold py-1 ${
                question.userVote === 'up' ? 'text-indigo-600' : question.userVote === 'down' ? 'text-rose-600' : 'text-slate-800'
              }`}>
                {question.upvotes - question.downvotes}
              </span>
              <button
                onClick={() => onVoteQuestion(question.id, 'down')}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  question.userVote === 'down'
                    ? 'text-rose-600 bg-rose-100'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-slate-200/60'
                }`}
              >
                <ChevronDown className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Question Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${urgencyInfo.bg} ${urgencyInfo.text}`}>
                  {urgencyInfo.label}
                </span>
                {question.acceptedAnswerId && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Solved
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {question.title}
              </h1>

              <div className="mt-4 text-slate-700 whitespace-pre-line leading-relaxed text-sm sm:text-base font-normal">
                {question.body}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author footer */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={question.author.avatar}
                    alt={question.author.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span>{question.author.name}</span>
                      {question.author.verifiedStudent && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                          Verified Student
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400">
                      {question.author.major} • Class of {question.author.graduationYear} • Asked {question.createdAt}
                    </div>
                  </div>
                </div>

                {/* AI Assistant Button */}
                <button
                  onClick={handleFetchAiExplanation}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {aiLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>Ask AI Study Copilot</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Explanation Box (if active) */}
          {aiExplanation && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/70 border border-indigo-200/80 shadow-xs relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-indigo-900 tracking-wide uppercase">
                    AskCampus AI Study Copilot Explanation
                  </span>
                </div>
                <span className="text-[11px] text-indigo-600 font-medium bg-indigo-100/70 px-2 py-0.5 rounded">
                  Instant Peer Tutor Guidance
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-mono-none">
                {aiExplanation}
              </div>
            </div>
          )}

          {/* Answers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>{question.answers.length} {question.answers.length === 1 ? 'Peer Answer' : 'Peer Answers'}</span>
              </h2>
              {isAuthor && (
                <span className="text-xs text-slate-500 italic">
                  Tip: Mark the best answer as the accepted solution
                </span>
              )}
            </div>

            {/* Answer List */}
            {sortedAnswers.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No answers yet!</p>
                <p className="text-xs text-slate-500 mt-1">Be the first to answer and earn +25 campus karma.</p>
              </div>
            ) : (
              sortedAnswers.map((answer) => (
                <div
                  key={answer.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    answer.isAccepted
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Answer Voting Column */}
                    <div className="flex flex-col items-center bg-slate-50 rounded-xl p-1.5 border border-slate-200 shrink-0">
                      <button
                        onClick={() => onVoteAnswer(question.id, answer.id, 'up')}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          answer.userVote === 'up'
                            ? 'text-indigo-600 bg-indigo-100'
                            : 'text-slate-400 hover:text-indigo-600'
                        }`}
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-bold text-slate-800">
                        {answer.upvotes - answer.downvotes}
                      </span>
                      <button
                        onClick={() => onVoteAnswer(question.id, answer.id, 'down')}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          answer.userVote === 'down'
                            ? 'text-rose-600 bg-rose-100'
                            : 'text-slate-400 hover:text-rose-600'
                        }`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>

                      {/* Accept checkmark button */}
                      {answer.isAccepted ? (
                        <div 
                          className="mt-2 text-emerald-600 p-1 bg-emerald-100 rounded-lg" 
                          title="Accepted Solution"
                        >
                          <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                        </div>
                      ) : (
                        isAuthor && (
                          <button
                            onClick={() => {
                              onAcceptAnswer(question.id, answer.id);
                              triggerConfetti();
                            }}
                            className="mt-2 text-slate-300 hover:text-emerald-600 p-1 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Mark as accepted solution"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )
                      )}
                    </div>

                    {/* Answer content */}
                    <div className="flex-1 min-w-0">
                      {/* Accepted Banner */}
                      {answer.isAccepted && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Accepted by Question Author</span>
                        </div>
                      )}

                      {/* Answer Body */}
                      <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                        {answer.body}
                      </div>

                      {/* Author row */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={answer.author.avatar}
                            alt={answer.author.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-800">{answer.author.name}</span>
                            {answer.isTAOrTutor && (
                              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                                Course TA
                              </span>
                            )}
                            <span className="text-slate-400">• {answer.author.college}</span>
                            <span className="text-slate-400">• {answer.createdAt}</span>
                          </div>
                        </div>

                        <div className="text-amber-500 font-semibold flex items-center gap-0.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>{answer.author.karma} karma</span>
                        </div>
                      </div>

                      {/* Comments under answer */}
                      {answer.comments && answer.comments.length > 0 && (
                        <div className="mt-3 pl-3 border-l-2 border-slate-200 space-y-2">
                          {answer.comments.map((c) => (
                            <div key={c.id} className="text-xs text-slate-600">
                              <span className="font-semibold text-slate-800 mr-1.5">{c.author.name}:</span>
                              <span>{c.text}</span>
                              <span className="text-slate-400 ml-2 text-[10px]">{c.createdAt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Write an Answer Form */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Your Answer
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Help your fellow student learn. Clear step-by-step logic and intuition gets the most upvotes and karma.
            </p>

            <form onSubmit={handlePostAnswer} className="space-y-3">
              {/* Toolbar */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-t-xl border border-b-0 border-slate-300">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1 rounded hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 px-2 cursor-pointer"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                  <span>Bold</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('```\n', '\n```')}
                  className="p-1 rounded hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 px-2 cursor-pointer"
                  title="Code snippet"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('$', '$')}
                  className="p-1 rounded hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 px-2 cursor-pointer"
                  title="Math Formula"
                >
                  <Sigma className="w-3.5 h-3.5" />
                  <span>Math</span>
                </button>
              </div>

              <textarea
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Write your explanation or solution here. You can include step-by-step reasoning, formulas, and course tips..."
                rows={4}
                required
                className="w-full text-sm p-3.5 rounded-b-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              />

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Answering earns <strong>+25 campus karma</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={!newAnswerText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Answer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
