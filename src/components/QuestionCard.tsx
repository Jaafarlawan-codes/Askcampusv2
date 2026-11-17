import React from 'react';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  CheckCircle2, 
  Bookmark, 
  Eye, 
  Zap,
  Share2
} from 'lucide-react';
import { Question } from '../types';
import { getUrgencyBadge } from '../utils/helpers';

interface QuestionCardProps {
  question: Question;
  onSelect: (question: Question) => void;
  onVote: (questionId: string, direction: 'up' | 'down', e: React.MouseEvent) => void;
  onToggleBookmark: (questionId: string, e: React.MouseEvent) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSelect,
  onVote,
  onToggleBookmark,
}) => {
  const urgencyInfo = getUrgencyBadge(question.urgency);
  const isSolved = Boolean(question.acceptedAnswerId);
  const netVotes = question.upvotes - question.downvotes;

  return (
    <article 
      onClick={() => onSelect(question)}
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Author + Meta + Solved indicator */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={question.author.avatar} 
              alt={question.author.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0" 
            />
            <div className="min-w-0 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <span className="font-bold text-slate-800 truncate">{question.author.name}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-500 truncate">{question.campus || question.author.school || question.author.college}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-400 shrink-0">{question.createdAt}</span>
            </div>
          </div>

          {/* Solved Badge */}
          {isSolved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Solved</span>
            </span>
          )}
        </div>

        {/* Course Code & Subject Metadata Row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/60 tracking-wide uppercase">
            {question.courseCode}
          </span>
          <span className="text-xs font-semibold text-slate-600">
            {question.category}
          </span>

          {question.urgency !== 'regular' && (
            <>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${urgencyInfo.bg} ${urgencyInfo.text}`}>
                <Zap className="w-3 h-3" />
                <span>{urgencyInfo.label}</span>
              </span>
            </>
          )}
        </div>

        {/* Question Title */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight">
          {question.title}
        </h3>

        {/* Question Body Snippet */}
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {question.body}
        </p>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {question.tags.map((tag) => (
              <span 
                key={tag}
                className="text-[11px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Modern Bottom Action Strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {/* Left: Vote Segmented Pill */}
        <div 
          className="inline-flex items-center bg-slate-100/80 hover:bg-slate-100 rounded-xl p-0.5 border border-slate-200/60"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => onVote(question.id, 'up', e)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer min-w-[32px] flex items-center justify-center ${
              question.userVote === 'up'
                ? 'text-blue-600 bg-white shadow-2xs font-bold'
                : 'text-slate-500 hover:text-blue-600'
            }`}
            title="Upvote"
          >
            <ArrowBigUp className={`w-4 h-4 ${question.userVote === 'up' ? 'fill-blue-600' : ''}`} />
          </button>
          <span className={`px-1.5 text-xs font-black tabular-nums ${
            question.userVote === 'up' ? 'text-blue-600' : question.userVote === 'down' ? 'text-rose-600' : 'text-slate-700'
          }`}>
            {netVotes}
          </span>
          <button
            onClick={(e) => onVote(question.id, 'down', e)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer min-w-[32px] flex items-center justify-center ${
              question.userVote === 'down'
                ? 'text-rose-600 bg-white shadow-2xs'
                : 'text-slate-400 hover:text-rose-600'
            }`}
            title="Downvote"
          >
            <ArrowBigDown className={`w-4 h-4 ${question.userVote === 'down' ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Right: Answers count + views + bookmark */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            isSolved 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' 
              : question.answersCount > 0 
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60' 
                : 'bg-slate-100 text-slate-600'
          }`}>
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="tabular-nums">{question.answersCount}</span>
            <span className="hidden sm:inline">{question.answersCount === 1 ? 'answer' : 'answers'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
            <Eye className="w-3.5 h-3.5" />
            <span className="tabular-nums">{question.views}</span>
          </div>

          <button
            onClick={(e) => onToggleBookmark(question.id, e)}
            className={`p-2 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
              question.isBookmarked 
                ? 'text-amber-500 bg-amber-50' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={question.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          >
            <Bookmark className={`w-4 h-4 ${question.isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
};
