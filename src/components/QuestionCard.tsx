import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  CheckCircle2, 
  Bookmark, 
  Eye, 
  Sparkles,
  Zap,
  Clock
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

  return (
    <div 
      onClick={() => onSelect(question)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 cursor-pointer group flex flex-col justify-between"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Voting column */}
        <div 
          className="flex flex-col items-center bg-slate-50 rounded-xl p-1 sm:p-1.5 border border-slate-200/70 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => onVote(question.id, 'up', e)}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              question.userVote === 'up'
                ? 'text-indigo-600 bg-indigo-100 font-bold'
                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60'
            }`}
            title="Upvote"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span className={`text-xs font-bold py-0.5 ${
            question.userVote === 'up' ? 'text-indigo-600' : question.userVote === 'down' ? 'text-rose-600' : 'text-slate-700'
          }`}>
            {question.upvotes - question.downvotes}
          </span>
          <button
            onClick={(e) => onVote(question.id, 'down', e)}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              question.userVote === 'down'
                ? 'text-rose-600 bg-rose-100'
                : 'text-slate-400 hover:text-rose-600 hover:bg-slate-200/60'
            }`}
            title="Downvote"
          >
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {/* Course Code */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white tracking-wide">
              {question.courseCode}
            </span>

            {/* Category */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
              {question.category}
            </span>

            {/* Urgency */}
            {question.urgency !== 'regular' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${urgencyInfo.bg} ${urgencyInfo.text}`}>
                <Zap className="w-3 h-3" />
                {urgencyInfo.label}
              </span>
            )}

            {/* Solved Status */}
            {isSolved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 ml-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Solved
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {question.title}
          </h3>

          {/* Body Snippet */}
          <p className="text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {question.body}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {question.tags.map((tag) => (
              <span 
                key={tag}
                className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded hover:bg-slate-200/70 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {/* Author info */}
        <div className="flex items-center gap-2">
          <img 
            src={question.author.avatar} 
            alt={question.author.name}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200" 
          />
          <div className="truncate">
            <span className="font-medium text-slate-700">{question.author.name}</span>
            <span className="hidden sm:inline text-slate-400"> ({question.author.college})</span>
            <span className="mx-1 text-slate-300">•</span>
            <span className="text-slate-400">{question.createdAt}</span>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-slate-500">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{question.views}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isSolved 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : question.answersCount > 0 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'bg-slate-100 text-slate-600'
          }`}>
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{question.answersCount} {question.answersCount === 1 ? 'answer' : 'answers'}</span>
          </div>

          <button
            onClick={(e) => onToggleBookmark(question.id, e)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              question.isBookmarked 
                ? 'text-amber-500 bg-amber-50' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={question.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          >
            <Bookmark className={`w-4 h-4 ${question.isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
