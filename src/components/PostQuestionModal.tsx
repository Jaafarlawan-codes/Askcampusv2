import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  HelpCircle, 
  Zap, 
  BookOpen, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import { Question, StudentProfile, UrgencyLevel } from '../types';
import { CATEGORIES } from '../data/mockData';
import { triggerConfetti } from '../utils/helpers';

interface PostQuestionModalProps {
  currentUser: StudentProfile;
  selectedCampus: string;
  onClose: () => void;
  onSubmit: (newQuestion: Question) => void;
}

export const PostQuestionModal: React.FC<PostQuestionModalProps> = ({
  currentUser,
  selectedCampus,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]); // Computer Science
  const [urgency, setUrgency] = useState<UrgencyLevel>('regular');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Coursework']);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().replace(/^#/, '')]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAiEnhance = () => {
    if (!title.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      // Intelligently enhance title and extract tags
      if (!title.endsWith('?')) {
        setTitle(title.trim() + '?');
      }
      if (courseCode) {
        if (!tags.includes('Midterm Prep')) {
          setTags((prev) => [...prev, 'Exam Review', courseCode.trim()]);
        }
      }
      setIsEnhancing(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !courseCode.trim()) return;

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      category: category === 'All Subjects' ? 'General' : category,
      tags: tags.length > 0 ? tags : ['StudyHelp'],
      urgency,
      campus: selectedCampus === 'All Campuses' ? currentUser.college : selectedCampus,
      author: currentUser,
      createdAt: 'Just now',
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      views: 1,
      answersCount: 0,
      answers: [],
      isBookmarked: false,
    };

    onSubmit(newQuestion);
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/file_000000006df08210b3718ff8855bd0e3_7e7e3969.png"
              alt="AskCampus"
              className="w-10 h-10 rounded-xl shadow-md object-cover ring-2 ring-white/20 shrink-0"
            />
            <div>
              <h2 className="text-base font-black">
                Ask<span className="text-amber-300">Campus</span> Community
              </h2>
              <p className="text-xs text-sky-100">
                Post any academic question or coursework request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course code & category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Course Code *
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS 161, MATH 51, CHEM 33"
                required
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold uppercase placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {CATEGORIES.filter((c) => c !== 'All Subjects').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Urgency / Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('regular')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  urgency === 'regular'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                General Question
              </button>
              <button
                type="button"
                onClick={() => setUrgency('exam_prep')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  urgency === 'exam_prep'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
              >
                ⚡ Midterm / Exam Prep
              </button>
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  urgency === 'urgent'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                🚨 Urgent Help
              </button>
            </div>
          </div>

          {/* Title with AI enhancement */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Question Title *
              </label>
              <button
                type="button"
                onClick={handleAiEnhance}
                disabled={!title.trim() || isEnhancing}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format & Suggest Tags</span>
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How do I construct the recurrence tree for the Master Theorem Case 2?"
              required
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Details & Context *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Explain the background, what you have already tried, where you are getting stuck, and specific formulas or code lines..."
              rows={5}
              required
              className="w-full text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag (e.g. Algorithms, PSet3) and press enter"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Posting As info & Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Posting as <strong>{currentUser.name}</strong> • {selectedCampus === 'All Campuses' ? currentUser.college : selectedCampus}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !body.trim() || !courseCode.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Post Question</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
